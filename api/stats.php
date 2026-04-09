<?php
// ══════════════════════════════════════════════════════════════
// LÉGAMO — Dashboard API
// Fetcha YouTube, Spotify e Instagram. Cachea 1 hora en cache.json
// ══════════════════════════════════════════════════════════════

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/config.php';

// ── Forzar refresh con ?refresh=1 ───────────────────────────
$force = isset($_GET['refresh']) && $_GET['refresh'] === '1';

// ── Caché ────────────────────────────────────────────────────
if (!$force && file_exists(CACHE_FILE)) {
    $cache = json_decode(file_get_contents(CACHE_FILE), true);
    if ($cache && (time() - ($cache['timestamp'] ?? 0)) < CACHE_TTL) {
        $cache['cached'] = true;
        echo json_encode($cache);
        exit;
    }
}

// ── Fetch todas las plataformas ──────────────────────────────
$data = [
    'timestamp' => time(),
    'cached'    => false,
    'youtube'   => fetch_youtube(),
    'spotify'   => fetch_spotify(),
    'instagram' => fetch_instagram(),
];

// Guardar caché
@file_put_contents(CACHE_FILE, json_encode($data));

echo json_encode($data);

// ════════════════════════════════════════════════════════════
// HELPERS HTTP
// ════════════════════════════════════════════════════════════

function http_get(string $url, array $headers = []): ?array {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_USERAGENT      => 'Legamo-Dashboard/1.0',
        ]);
        $body = curl_exec($ch);
        $err  = curl_error($ch);
        curl_close($ch);
        if ($err || !$body) return null;
    } else {
        $opts = ['http' => [
            'method'        => 'GET',
            'ignore_errors' => true,
            'timeout'       => 10,
            'header'        => implode("\r\n", $headers),
        ]];
        $body = @file_get_contents($url, false, stream_context_create($opts));
        if (!$body) return null;
    }
    return json_decode($body, true);
}

function http_post(string $url, string $body, array $headers = []): ?array {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $body,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $result = curl_exec($ch);
        curl_close($ch);
        return $result ? json_decode($result, true) : null;
    }
    $opts = ['http' => [
        'method'        => 'POST',
        'content'       => $body,
        'ignore_errors' => true,
        'timeout'       => 10,
        'header'        => implode("\r\n", $headers),
    ]];
    $result = @file_get_contents($url, false, stream_context_create($opts));
    return $result ? json_decode($result, true) : null;
}

// ════════════════════════════════════════════════════════════
// YOUTUBE
// ════════════════════════════════════════════════════════════

function fetch_youtube(): array {
    $base = 'https://www.googleapis.com/youtube/v3/';
    $key  = YT_API_KEY;
    $cid  = YT_CHANNEL_ID;

    // Canal: estadísticas generales
    $channel = http_get("{$base}channels?part=statistics,snippet&id={$cid}&key={$key}");
    if (!$channel || empty($channel['items'])) {
        return ['error' => 'No se pudo obtener el canal de YouTube'];
    }

    $stats = $channel['items'][0]['statistics'];

    // Últimos 6 videos publicados
    $search = http_get("{$base}search?part=snippet&channelId={$cid}&type=video&order=date&maxResults=6&key={$key}");
    $videos = [];

    if ($search && !empty($search['items'])) {
        $ids = implode(',', array_map(fn($i) => $i['id']['videoId'], $search['items']));
        $vdata = http_get("{$base}videos?part=statistics,snippet&id={$ids}&key={$key}");

        foreach ($vdata['items'] ?? [] as $v) {
            $videos[] = [
                'id'        => $v['id'],
                'title'     => $v['snippet']['title'],
                'views'     => (int)($v['statistics']['viewCount']    ?? 0),
                'likes'     => (int)($v['statistics']['likeCount']    ?? 0),
                'comments'  => (int)($v['statistics']['commentCount'] ?? 0),
                'thumbnail' => $v['snippet']['thumbnails']['medium']['url'] ?? '',
                'url'       => 'https://www.youtube.com/watch?v=' . $v['id'],
                'published' => substr($v['snippet']['publishedAt'], 0, 10),
            ];
        }
    }

    return [
        'subscribers' => (int)($stats['subscriberCount'] ?? 0),
        'views'       => (int)($stats['viewCount']       ?? 0),
        'videos'      => (int)($stats['videoCount']      ?? 0),
        'latest'      => $videos,
    ];
}

// ════════════════════════════════════════════════════════════
// SPOTIFY
// ════════════════════════════════════════════════════════════

function fetch_spotify(): array {
    // 1. Token via Client Credentials
    $credentials = base64_encode(SP_CLIENT_ID . ':' . SP_CLIENT_SECRET);
    $token_data  = http_post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        [
            "Authorization: Basic {$credentials}",
            'Content-Type: application/x-www-form-urlencoded',
        ]
    );

    if (!$token_data || empty($token_data['access_token'])) {
        return ['error' => 'No se pudo autenticar con Spotify'];
    }

    $token = $token_data['access_token'];

    // 2. Datos del artista
    $artist = http_get(
        'https://api.spotify.com/v1/artists/' . SP_ARTIST_ID,
        ["Authorization: Bearer {$token}"]
    );

    if (!$artist || isset($artist['error'])) {
        return ['error' => 'No se pudo obtener el artista de Spotify'];
    }

    // 3. Últimos álbumes
    $albums_data = http_get(
        'https://api.spotify.com/v1/artists/' . SP_ARTIST_ID . '/albums?include_groups=album,single&market=CL&limit=5',
        ["Authorization: Bearer {$token}"]
    );

    $albums = [];
    foreach ($albums_data['items'] ?? [] as $a) {
        $albums[] = [
            'name'        => $a['name'],
            'type'        => $a['album_type'],
            'released'    => $a['release_date'],
            'url'         => $a['external_urls']['spotify'] ?? '',
            'image'       => $a['images'][1]['url'] ?? ($a['images'][0]['url'] ?? ''),
        ];
    }

    return [
        'followers'  => $artist['followers']['total'] ?? 0,
        'popularity' => $artist['popularity'] ?? 0,
        'genres'     => $artist['genres'] ?? [],
        'url'        => $artist['external_urls']['spotify'] ?? '',
        'albums'     => $albums,
    ];
}

// ════════════════════════════════════════════════════════════
// INSTAGRAM
// ════════════════════════════════════════════════════════════

function fetch_instagram(): array {
    $token = IG_ACCESS_TOKEN;
    $base  = 'https://graph.facebook.com/v19.0/';

    // 1. Obtener páginas vinculadas al token
    $pages = http_get("{$base}me/accounts?access_token={$token}");
    if (!$pages || empty($pages['data'])) {
        return ['error' => 'Token inválido o expirado — renovar en developers.facebook.com'];
    }

    // Buscar la página con Instagram vinculado
    $ig_id = null;
    foreach ($pages['data'] as $page) {
        $ig_link = http_get("{$base}{$page['id']}?fields=instagram_business_account&access_token={$token}");
        if (!empty($ig_link['instagram_business_account']['id'])) {
            $ig_id = $ig_link['instagram_business_account']['id'];
            break;
        }
    }

    if (!$ig_id) {
        return ['error' => 'No se encontró cuenta de Instagram Business vinculada a la página'];
    }

    // 2. Info de la cuenta
    $info = http_get("{$base}{$ig_id}?fields=followers_count,media_count,username,biography&access_token={$token}");
    if (!$info) {
        return ['error' => 'No se pudo obtener información de la cuenta'];
    }

    // 3. Insights de los últimos 7 días
    $since = time() - (7 * 24 * 3600);
    $until = time();
    $insights_url = "{$base}{$ig_id}/insights?metric=reach,impressions,profile_views&period=day&since={$since}&until={$until}&access_token={$token}";
    $insights = http_get($insights_url);

    $reach = 0; $impressions = 0; $profile_views = 0;

    if (!empty($insights['data'])) {
        foreach ($insights['data'] as $metric) {
            $total = array_sum(array_column($metric['values'] ?? [], 'value'));
            switch ($metric['name']) {
                case 'reach':         $reach         = $total; break;
                case 'impressions':   $impressions   = $total; break;
                case 'profile_views': $profile_views = $total; break;
            }
        }
    }

    // 4. Últimos 6 posts
    $media_url = "{$base}{$ig_id}/media?fields=id,caption,media_type,thumbnail_url,media_url,timestamp,like_count,comments_count,permalink&limit=6&access_token={$token}";
    $media_data = http_get($media_url);
    $posts = [];

    foreach ($media_data['data'] ?? [] as $m) {
        $posts[] = [
            'id'       => $m['id'],
            'type'     => $m['media_type'],
            'caption'  => mb_substr($m['caption'] ?? '', 0, 80),
            'likes'    => $m['like_count']     ?? 0,
            'comments' => $m['comments_count'] ?? 0,
            'date'     => substr($m['timestamp'] ?? '', 0, 10),
            'url'      => $m['permalink']      ?? '',
            'thumb'    => $m['thumbnail_url']  ?? $m['media_url'] ?? '',
        ];
    }

    return [
        'username'        => $info['username']       ?? '',
        'followers'       => $info['followers_count'] ?? 0,
        'posts'           => $info['media_count']     ?? 0,
        'reach_7d'        => $reach,
        'impressions_7d'  => $impressions,
        'profile_views_7d'=> $profile_views,
        'latest_posts'    => $posts,
    ];
}
