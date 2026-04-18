# VidHub Compatibility Notes

VidHub prefixes all Jellyfin API routes with /emby.
Fix: register jellyfinRoutes twice in src/index.ts:

    await app.register(jellyfinRoutes)
    await app.register(jellyfinRoutes, { prefix: '/emby' })

This covers all routes without needing individual aliases.
