"use client";

import { ExternalLink, MapPin, Minus, Plus, RotateCcw } from "lucide-react";
import {
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type MapPoint = {
  lat: number;
  lon: number;
};

export type MapBounds = {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
};

export type LocalMapLocation = {
  name: string;
  address: string;
  mapQuery: string;
  point: MapPoint;
  dataFile: string;
  bounds: MapBounds;
};

type OsmElement = {
  id: number;
  type: "way" | string;
  lat?: number;
  lon?: number;
  center?: MapPoint;
  geometry?: MapPoint[];
  tags?: Record<string, string>;
};

type OsmResponse = {
  elements?: OsmElement[];
};

type ViewState = {
  zoom: number;
  x: number;
  y: number;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

type MapLabel = {
  id: number;
  name: string;
  x: number;
  y: number;
  priority: number;
};

const WIDTH = 1000;
const HEIGHT = 650;
const MAX_ZOOM = 3.2;
const MULTI_POINT_PADDING = 70;
const mapDataCache = new Map<string, Promise<OsmElement[]>>();

const greenLanduses = new Set([
  "allotments",
  "cemetery",
  "forest",
  "grass",
  "meadow",
  "recreation_ground",
  "village_green",
]);

const majorRoads = new Set(["primary", "secondary"]);
const mediumRoads = new Set(["residential", "unclassified", "living_street"]);
const roadPriority: Record<string, number> = {
  primary: 0,
  secondary: 1,
  tertiary: 2,
  residential: 3,
  unclassified: 4,
  living_street: 5,
  pedestrian: 6,
};

function getElementPoint(element: OsmElement) {
  if (typeof element.lat === "number" && typeof element.lon === "number") {
    return { lat: element.lat, lon: element.lon };
  }

  if (element.center) {
    return element.center;
  }

  if (element.geometry?.length) {
    return element.geometry[Math.floor(element.geometry.length / 2)];
  }

  return null;
}

function getYandexMapsUrl(location: LocalMapLocation) {
  const params = new URLSearchParams({
    ll: `${location.point.lon},${location.point.lat}`,
    mode: "search",
    text: location.mapQuery,
    z: "17",
  });

  return `https://yandex.ru/maps/?${params.toString()}`;
}

function projectMapPoint(point: MapPoint, bounds: MapBounds) {
  return {
    x: ((point.lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * WIDTH,
    y: ((bounds.maxLat - point.lat) / (bounds.maxLat - bounds.minLat)) * HEIGHT,
  };
}

function getInitialView(location: LocalMapLocation, locations: LocalMapLocation[]): ViewState {
  const points = locations.map((item) => projectMapPoint(item.point, location.bounds));

  if (points.length === 1) {
    return {
      zoom: MAX_ZOOM,
      x: WIDTH / 2 - points[0].x * MAX_ZOOM,
      y: HEIGHT / 2 - points[0].y * MAX_ZOOM,
    };
  }

  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const zoom = Math.min(
    MAX_ZOOM,
    (WIDTH - MULTI_POINT_PADDING * 2) / spanX,
    (HEIGHT - MULTI_POINT_PADDING * 2) / spanY,
  );
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return {
    zoom,
    x: WIDTH / 2 - centerX * zoom,
    y: HEIGHT / 2 - centerY * zoom,
  };
}

function loadMapElements(dataFile: string) {
  const cachedRequest = mapDataCache.get(dataFile);

  if (cachedRequest) {
    return cachedRequest;
  }

  const request = fetch(dataFile)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Не удалось загрузить локальные данные карты");
      }

      return response.json() as Promise<OsmResponse>;
    })
    .then((data) => data.elements ?? [])
    .catch((error: unknown) => {
      mapDataCache.delete(dataFile);
      throw error;
    });

  mapDataCache.set(dataFile, request);

  return request;
}

function MapControls({
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  const buttonClass =
    "flex h-8 w-8 items-center justify-center border-b border-neutral-200 bg-white text-black transition-colors last:border-b-0 hover:bg-[var(--color-brand-bg)] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[var(--color-brand-blue)] sm:h-9 sm:w-9";

  return (
    <div className="absolute right-2 top-2 z-20 overflow-hidden rounded-[6px] border border-neutral-200 shadow-md sm:right-3 sm:top-3">
      <button type="button" onClick={onZoomIn} className={buttonClass} aria-label="Увеличить карту">
        <Plus size={19} />
      </button>
      <button type="button" onClick={onZoomOut} className={buttonClass} aria-label="Уменьшить карту">
        <Minus size={19} />
      </button>
      <button type="button" onClick={onReset} className={buttonClass} aria-label="Вернуть исходный масштаб карты">
        <RotateCcw size={17} />
      </button>
    </div>
  );
}

export function LocalInteractiveMap({
  location,
  locations,
  compact = false,
}: {
  location: LocalMapLocation;
  locations?: LocalMapLocation[];
  compact?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [elements, setElements] = useState<OsmElement[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const mapLocations = useMemo(() => locations ?? [location], [location, locations]);
  const initialView = useMemo(
    () => getInitialView(location, mapLocations),
    [location, mapLocations],
  );
  const [view, setView] = useState<ViewState>(initialView);
  const { bounds } = location;

  useEffect(() => {
    let isCancelled = false;

    loadMapElements(location.dataFile)
      .then((loadedElements) => {
        if (isCancelled) {
          return;
        }

        setElements(loadedElements);
        setLoadState("ready");
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }

        setLoadState("error");
      });

    return () => {
      isCancelled = true;
    };
  }, [location.dataFile]);

  const project = useMemo(
    () =>
      (point: MapPoint) => ({
        x: ((point.lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * WIDTH,
        y: ((bounds.maxLat - point.lat) / (bounds.maxLat - bounds.minLat)) * HEIGHT,
      }),
    [bounds],
  );

  const isInside = useMemo(
    () =>
      (point: MapPoint) =>
        point.lat >= bounds.minLat &&
        point.lat <= bounds.maxLat &&
        point.lon >= bounds.minLon &&
        point.lon <= bounds.maxLon,
    [bounds],
  );

  const toPath = useMemo(
    () =>
      (geometry: MapPoint[]) => {
        const points = geometry.filter(isInside).map(project);

        if (points.length < 2) {
          return "";
        }

        return points
          .map(
            (point, index) =>
              `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
          )
          .join(" ");
      },
    [isInside, project],
  );

  const mapLayers = useMemo(() => {
    const parks: OsmElement[] = [];
    const water: OsmElement[] = [];
    const buildings: OsmElement[] = [];
    const railways: OsmElement[] = [];
    const roads: OsmElement[] = [];
    const roadLabels: MapLabel[] = [];
    const placeLabels: MapLabel[] = [];
    const transitLabels: MapLabel[] = [];
    const usedNames = new Set<string>();

    for (const element of elements) {
      const tags = element.tags ?? {};
      const point = getElementPoint(element);

      if (
        tags.name &&
        point &&
        isInside(point) &&
        (tags.station === "subway" ||
          tags.railway === "station" ||
          tags.railway === "halt" ||
          tags.public_transport === "station") &&
        !usedNames.has(`transit-${tags.name}`)
      ) {
        transitLabels.push({
          id: element.id,
          name: tags.name,
          priority: tags.station === "subway" ? 0 : 1,
          ...project(point),
        });
        usedNames.add(`transit-${tags.name}`);
      }

      if (
        tags.amenity === "school" &&
        tags.name &&
        point &&
        isInside(point) &&
        placeLabels.length < 5
      ) {
        placeLabels.push({
          id: element.id,
          name: tags.name,
          priority: 0,
          ...project(point),
        });
      }

      if (!element.geometry || element.geometry.length < 2) {
        continue;
      }

      if (tags.natural === "water" || tags.waterway) {
        water.push(element);
      } else if (greenLanduses.has(tags.landuse) || tags.leisure === "park") {
        parks.push(element);
      } else if (tags.building) {
        buildings.push(element);
      } else if (tags.railway) {
        railways.push(element);
      } else if (tags.highway) {
        roads.push(element);

        if (tags.name && !usedNames.has(tags.name) && point && isInside(point)) {
          roadLabels.push({
            id: element.id,
            name: tags.name,
            priority: roadPriority[tags.highway] ?? 9,
            ...project(point),
          });
          usedNames.add(tags.name);
        }
      }
    }

    return {
      parks,
      water,
      buildings,
      railways,
      roads,
      placeLabels,
      transitLabels: transitLabels.sort((a, b) => a.priority - b.priority).slice(0, compact ? 2 : 4),
      roadLabels: roadLabels
        .sort((a, b) => a.priority - b.priority)
        .slice(0, compact ? 14 : 28),
    };
  }, [compact, elements, isInside, project]);

  function zoomAt(nextZoom: number, focusX = WIDTH / 2, focusY = HEIGHT / 2) {
    setView((current) => {
      const zoom = Math.min(MAX_ZOOM, Math.max(1, nextZoom));
      const mapX = (focusX - current.x) / current.zoom;
      const mapY = (focusY - current.y) / current.zoom;

      return {
        zoom,
        x: focusX - mapX * zoom,
        y: focusY - mapY * zoom,
      };
    });
  }

  function handleWheel(event: ReactWheelEvent<SVGSVGElement>) {
    event.preventDefault();
    event.stopPropagation();
    const viewBounds = event.currentTarget.getBoundingClientRect();
    const focusX = ((event.clientX - viewBounds.left) / viewBounds.width) * WIDTH;
    const focusY = ((event.clientY - viewBounds.top) / viewBounds.height) * HEIGHT;
    const factor = event.deltaY < 0 ? 1.18 : 1 / 1.18;

    zoomAt(view.zoom * factor, focusX, focusY);
  }

  function handlePointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: view.x,
      originY: view.y,
    };
  }

  function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId || !svgRef.current) {
      return;
    }

    const viewBounds = svgRef.current.getBoundingClientRect();
    const deltaX = ((event.clientX - drag.startX) / viewBounds.width) * WIDTH;
    const deltaY = ((event.clientY - drag.startY) / viewBounds.height) * HEIGHT;

    setView((current) => ({
      ...current,
      x: drag.originX + deltaX,
      y: drag.originY + deltaY,
    }));
  }

  function handlePointerEnd(event: ReactPointerEvent<SVGSVGElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  const hallPoints = mapLocations.map((item) => ({
    location: item,
    point: project(item.point),
  }));
  const isMultiPointMap = hallPoints.length > 1;

  return (
    <div className="relative h-full min-h-0 overscroll-contain overflow-hidden rounded-[4px] border border-neutral-200 bg-[#eef2f5]">
      {loadState === "loading" ? (
        <div className="flex h-full items-center justify-center text-sm font-medium text-neutral-600">
          Загружаем локальную карту…
        </div>
      ) : null}

      {loadState === "error" ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center text-sm font-medium text-neutral-700">
          <MapPin size={28} className="text-[var(--color-brand-red)]" />
          <span>Не удалось открыть локальную карту.</span>
          <span>{location.address}</span>
          <a
            href={getYandexMapsUrl(location)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[var(--color-brand-blue)]"
          >
            Открыть адрес в Яндекс Картах
          </a>
        </div>
      ) : null}

      {loadState === "ready" ? (
        <>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-full w-full cursor-grab select-none touch-none active:cursor-grabbing"
            role="img"
            aria-label={
              isMultiPointMap
                ? `Интерактивная локальная карта: ${hallPoints.length} зала`
                : `Интерактивная локальная карта: ${location.address}`
            }
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            <rect width={WIDTH} height={HEIGHT} fill="#f4f6f8" />
            <g transform={`translate(${view.x} ${view.y}) scale(${view.zoom})`}>
              {mapLayers.parks.map((element) => (
                <path
                  key={`park-${element.id}`}
                  d={toPath(element.geometry ?? [])}
                  fill="#dcebd5"
                  stroke="#c8ddc0"
                  strokeWidth="1"
                />
              ))}
              {mapLayers.water.map((element) => (
                <path
                  key={`water-${element.id}`}
                  d={toPath(element.geometry ?? [])}
                  fill="#cce8f4"
                  stroke="#9bcfe4"
                  strokeWidth="1.5"
                />
              ))}
              {mapLayers.buildings.map((element) => (
                <path
                  key={`building-${element.id}`}
                  d={toPath(element.geometry ?? [])}
                  fill="#d9dee3"
                  stroke="#c0c7ce"
                  strokeWidth="1"
                />
              ))}
              {mapLayers.railways.map((element) => (
                <g key={`rail-${element.id}`}>
                  <path
                    d={toPath(element.geometry ?? [])}
                    fill="none"
                    stroke="#a7adb4"
                    strokeWidth="4"
                  />
                  <path
                    d={toPath(element.geometry ?? [])}
                    fill="none"
                    stroke="#ffffff"
                    strokeDasharray="8 7"
                    strokeWidth="2"
                  />
                </g>
              ))}
              {mapLayers.roads.map((element) => {
                const highway = element.tags?.highway ?? "";
                const width = majorRoads.has(highway)
                  ? 11
                  : highway === "tertiary"
                    ? 8
                    : mediumRoads.has(highway)
                      ? 6
                      : 3;
                const roadColor = majorRoads.has(highway) ? "#fff1c4" : "#ffffff";

                return (
                  <g key={`road-${element.id}`}>
                    <path
                      d={toPath(element.geometry ?? [])}
                      fill="none"
                      stroke="#d5d9dd"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={width + 3}
                    />
                    <path
                      d={toPath(element.geometry ?? [])}
                      fill="none"
                      stroke={roadColor}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={width}
                    />
                  </g>
                );
              })}
              {mapLayers.roadLabels.map((label) => (
                <text
                  key={`road-label-${label.id}`}
                  x={label.x}
                  y={label.y}
                  fill="#4b5560"
                  fontSize={(label.priority <= 2 ? 14 : 11) / view.zoom}
                  fontWeight={label.priority <= 2 ? "700" : "600"}
                  textAnchor="middle"
                  style={{
                    paintOrder: "stroke",
                    stroke: "white",
                    strokeWidth: 4 / view.zoom,
                    strokeLinejoin: "round",
                  }}
                >
                  {label.name}
                </text>
              ))}
              {mapLayers.placeLabels.map((label) => (
                <text
                  key={`place-label-${label.id}`}
                  x={label.x}
                  y={label.y}
                  fill="#66717c"
                  fontSize={10 / view.zoom}
                  fontWeight="600"
                  textAnchor="middle"
                  style={{
                    paintOrder: "stroke",
                    stroke: "white",
                    strokeWidth: 4 / view.zoom,
                    strokeLinejoin: "round",
                  }}
                >
                  {label.name}
                </text>
              ))}
              {mapLayers.transitLabels.map((label) => (
                <g key={`transit-${label.id}`} transform={`translate(${label.x} ${label.y})`}>
                  <g transform={`scale(${1 / view.zoom})`}>
                    <circle r="13" fill="#ffffff" stroke="#A1A2A3" strokeWidth="5" />
                    <text y="5" fill="#555b61" fontSize="12" fontWeight="900" textAnchor="middle">
                      {label.priority === 0 ? "М" : "D"}
                    </text>
                    <text
                      x="21"
                      y="5"
                      fill="#252a2f"
                      fontSize="14"
                      fontWeight="800"
                      textAnchor="start"
                      style={{
                        paintOrder: "stroke",
                        stroke: "white",
                        strokeWidth: 5,
                        strokeLinejoin: "round",
                      }}
                    >
                      {label.name}
                    </text>
                  </g>
                </g>
              ))}

              {hallPoints.map(({ location: hallLocation, point }) => (
                <a
                  key={`${hallLocation.point.lat}-${hallLocation.point.lon}-marker`}
                  href={getYandexMapsUrl(hallLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerDown={(event) => event.stopPropagation()}
                  className="cursor-pointer"
                >
                  <g transform={`translate(${point.x} ${point.y})`}>
                    <g transform={`scale(${1 / view.zoom})`}>
                      <circle r="25" fill="rgba(226, 30, 37, 0.18)" />
                      <circle r="10" fill="var(--color-brand-red)" stroke="white" strokeWidth="4" />
                      <text
                        x="18"
                        y="5"
                        fill="#111827"
                        fontSize={isMultiPointMap ? "12" : compact ? "13" : "15"}
                        fontWeight="800"
                        textAnchor="start"
                        style={{
                          paintOrder: "stroke",
                          stroke: "white",
                          strokeWidth: 5,
                          strokeLinejoin: "round",
                        }}
                      >
                        {hallLocation.address}
                      </text>
                    </g>
                  </g>
                </a>
              ))}
            </g>
          </svg>

          <MapControls
            onZoomIn={() => zoomAt(view.zoom * 1.25)}
            onZoomOut={() => zoomAt(view.zoom / 1.25)}
            onReset={() => setView(initialView)}
          />

          <div
            className={[
              "absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between gap-3 rounded-[6px] bg-white/95 text-neutral-700 shadow-lg backdrop-blur-sm sm:bottom-3 sm:left-3 sm:right-3",
              compact ? "px-3 py-2 text-xs leading-4" : "px-3 py-2.5 text-xs leading-4 sm:px-4 sm:py-3 sm:text-sm sm:leading-5",
            ].join(" ")}
          >
            <p className="flex min-w-0 items-center gap-1.5 truncate font-bold text-black sm:gap-2">
              <MapPin size={compact ? 15 : 18} className="shrink-0 text-[var(--color-brand-red)]" />
              <span className="truncate">
                {isMultiPointMap
                  ? `${hallPoints.length} зала — нажмите на точку, чтобы открыть адрес`
                  : location.address}
              </span>
            </p>

            {!isMultiPointMap ? <a
              href={getYandexMapsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "inline-flex shrink-0 items-center gap-1.5 rounded-[6px] bg-[var(--color-brand-blue)] font-bold text-white transition-colors hover:bg-[#245ba8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-blue)]",
                compact ? "px-2.5 py-2" : "px-3 py-2 sm:px-4 sm:py-2.5",
              ].join(" ")}
              aria-label={`Открыть адрес ${location.address} в Яндекс Картах`}
            >
              <span className={compact ? "hidden min-[560px]:inline" : "hidden sm:inline"}>
                Яндекс Карты
              </span>
              <span className={compact ? "min-[560px]:hidden" : "sm:hidden"}>Маршрут</span>
              <ExternalLink size={compact ? 15 : 17} strokeWidth={2.4} />
            </a> : null}
          </div>

          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-[67px] right-2 z-20 rounded bg-white/90 px-1.5 py-0.5 text-[9px] leading-none text-neutral-600 hover:text-black sm:bottom-[78px] sm:right-3 sm:text-[10px]"
          >
            © OpenStreetMap
          </a>
        </>
      ) : null}
    </div>
  );
}
