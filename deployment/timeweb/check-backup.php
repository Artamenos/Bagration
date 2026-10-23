<?php
// CLI only. Upload outside public_html; restores only to a new private temporary directory.
declare(strict_types=1);
if(PHP_SAPI!=='cli') exit;
umask(0077);
$base=__DIR__; $backup=realpath($argv[1]??''); $root=realpath($base.'/shared/backups');
if(!$backup || !$root || !str_starts_with($backup,$root.'/') || dirname($backup)!==$root) throw new RuntimeException('Invalid backup directory');
$manifest=json_decode(file_get_contents($backup.'/manifest.json'),true,512,JSON_THROW_ON_ERROR);
foreach(['database.sql','shared.tar.gz'] as $file) if(!hash_equals($manifest['files'][$file],hash_file('sha256',$backup.'/'.$file))) throw new RuntimeException('Backup checksum mismatch');
$temporary=$backup.'/.restore-check-'.bin2hex(random_bytes(6)); mkdir($temporary,0700);
try {
    $process=proc_open(['tar','-xzf',$backup.'/shared.tar.gz','-C',$temporary],[0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']],$pipes);
    fclose($pipes[0]); stream_get_contents($pipes[1]); fclose($pipes[1]); stream_get_contents($pipes[2]); fclose($pipes[2]);
    if(proc_close($process)!==0) throw new RuntimeException('Archive restore failed');
    $content=json_decode(file_get_contents($temporary.'/content/current.json'),true,512,JSON_THROW_ON_ERROR);
    if(count($content['news'])!==$manifest['news'] || count($content['events'])!==$manifest['events']) throw new RuntimeException('Restored snapshot count mismatch');
    if(!hash_equals(hash_file('sha256',$base.'/shared/config.php'),hash_file('sha256',$temporary.'/config.php'))) throw new RuntimeException('Restored configuration mismatch');
    $count=0;
    foreach(['news','events'] as $kind) foreach($content[$kind] as $item) if(isset($item['image']) && str_starts_with($item['image'],'/media/')) {
        if(!preg_match('~^/media/[a-f0-9]{32}\.jpg$~',$item['image'])) throw new RuntimeException('Invalid media path');
        $path=$temporary.$item['image'];
        if(!is_file($path) || !getimagesize($path)) throw new RuntimeException('Restored image missing');
        if(!hash_equals(hash_file('sha256',$base.'/shared'.$item['image']),hash_file('sha256',$path))) throw new RuntimeException('Restored image differs');
        $count++;
    }
    echo 'PASS: archive checksums, private restore, configuration, published JSON and '.$count." media references verified.\n";
} finally {
    if(dirname($temporary)===$backup && str_starts_with(basename($temporary),'.restore-check-') && !is_link($temporary)) {
        foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($temporary,FilesystemIterator::SKIP_DOTS),RecursiveIteratorIterator::CHILD_FIRST) as $file) $file->isDir()&&!$file->isLink()?rmdir($file->getPathname()):unlink($file->getPathname());
        rmdir($temporary);
    }
}
