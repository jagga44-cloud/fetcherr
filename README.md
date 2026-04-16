# Fetcherr

Jellyfin-compatible bridge for Infuse with Trakt library sync and Real-Debrid-backed stream resolution.

## What It Does

- Syncs movies and shows from Trakt watchlists and selected Trakt lists
- Exposes a Jellyfin-style library for Infuse
- Resolves playback through direct providers such as Torrentio and Debridio
- Verifies ambiguous audio with `ffprobe` when needed

## Requirements

- TMDB API key
- Real-Debrid API key
- Trakt client ID and secret
- A Trakt account

## Setup

1. Copy `.env.example` to `.env`
2. Fill in your API keys and Trakt username
3. Optionally set:
   - `UI_USERNAME`
   - `UI_PASSWORD`
   - `STREAM_PROVIDER_URLS`
   - `ENGLISH_STREAM_MODE`
4. Start the app:

```bash
docker compose up -d --build
```

5. Open:

```text
http://YOUR_SERVER:9990/ui/setup
```

6. Connect Trakt
7. Open Settings and configure provider URLs if needed

## Usage

- Connect Trakt in `/ui/setup`
- Configure providers and preferences in `/ui/settings`
- Add Fetcherr to Infuse as a Jellyfin server
- Browse and play from Infuse
- Use `/ui/logs` when sync or playback fails

## Environment

- `TMDB_API_KEY`: TMDB metadata and artwork
- `RD_API_KEY`: Real-Debrid API access
- `TRAKT_CLIENT_ID`: Trakt OAuth client ID
- `TRAKT_CLIENT_SECRET`: Trakt OAuth client secret
- `TRAKT_USERNAME`: Trakt username to sync from
- `TRAKT_LISTS`: comma-separated Trakt list slugs to sync in addition to watchlists
- `SERVER_URL`: external base URL used for playback redirects
- `UI_USERNAME`: web UI login username
- `UI_PASSWORD`: web UI login password; leave blank to disable UI auth
- `AIOSTREAM_URL`: optional legacy AIOStreams manifest or base URL
- `STREAM_PROVIDER_URLS`: optional provider URLs, one per line
- `ENGLISH_STREAM_MODE`: `off`, `prefer`, or `require`

## Tips

- Provider order matters; earlier providers are tried first
- `ENGLISH_STREAM_MODE=require` is the strictest option for English audio
- Full manifest URLs are accepted and normalized automatically
- `SOOTIO_URL` is still supported as a backward-compatible alias for `AIOSTREAM_URL`
- Real-Debrid multi-location/IP restrictions still apply

## Current Limitations

- Anime has not been validated thoroughly yet
- Some metadata may still be enriched by Infuse itself
- `Logo` image behavior may vary by client
