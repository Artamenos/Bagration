<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli') { http_response_code(404); exit; }
require __DIR__.'/runtime.php';
// RFC 6238 Appendix B, SHA1, truncated to six digits.
foreach([59=>'287082',1111111109=>'081804',1111111111=>'050471',1234567890=>'005924',2000000000=>'279037',20000000000=>'353130'] as $time=>$expected) {
    if(totp('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ',(int)floor($time/30))!==$expected) throw new RuntimeException('TOTP vector failed');
}
foreach(['javascript:alert(1)','http://example.org','/bad.php'] as $url) {
    $rejected=false;
    try { validateItem(['title'=>'test','date'=>'2026-10-23','category'=>'test','description'=>'test','details'=>'test','image'=>'/images/112.jpg','detailsUrl'=>$url],'news'); } catch(RuntimeException $e) { $rejected=true; }
    if(!$rejected) throw new LogicException('Unsafe URL accepted');
}
if(validDate('2026-02-30')) throw new RuntimeException('Invalid date accepted');
echo "TOTP and validation tests passed.\n";
