# Crowd and HUD maintenance review

Reviewed against Gemini main `8f555369d8cb5b8543c99a92473b3bbe7a9f334d`.

## Movement and traffic

- Counter-customer shopping motion used to overwrite positions after the pedestrian collision pass. It now moves at a bounded speed, turns before walking and checks world, peers and vehicles.
- The older 24 promenade walkers now use the same avoidance controller, with their existing promenade loops supplying goals. Their bodies remain outside the roadway. Photographers and officers participate in pedestrian clearance; original models and counts are retained.
- People already on a zebra crossing must finish passing one another even when admission closes. Previously their detours were cancelled, trapping opposing pedestrians and holding electric delivery riders at the stop line indefinitely. Waiting queues still obey the admission signal.
- Surface pedestrian occupancy is checked per crossing and by height, rather than holding two crossings together. Existing red/amber stop distances, vehicle collision and pedestrian priority remain.
- `nanjing-mixed-crowd.test.mjs` uses the real world, 149 people, eight electric delivery riders, buses and cars, with varying 16–100 ms steps. It checks facing, continuity, peer clearance, rider contact and final-minute progress. Keep this distinct from the narrower 55-person test.

## Interface and engineering

- Desktop coordinates follow the actual tracked-task height, including wrapping and dragging. Layout observers replace per-frame measurement; mobile keeps its compact coordinate row.
- Landscape dialogue rules had explicit left alignment and repeatedly subtracted 310–330 px from content width. Names and subtitles now centre across the dialogue. Topic rows remain separately scrollable, with an explicit hidden rule that wins the mobile cascade.
- Travel and save restoration clear the bench's sitting state without changing the arrival point. Audio resume rejection is caught and short UI sound nodes disconnect after finishing.
- Stable HUD strings are written only when changed. Vehicle footprint checks reuse the same sine/cosine for all nine probes. These preserve displayed content and collision calculations; they are not a claim of a particular FPS improvement.
- Initial construction yields between existing city/metro/garden preparation stages so loading messages can paint. This improves loading feedback, rather than making synchronous world generation free. Historical update illustrations load on demand. Both publishing paths exclude all `__` preview assets.

## Bus stop artwork

The original procedural plates use white/red/green hierarchy, metallic double-post frames, readable front and back faces, current-stop colour and a direction arrow. `游1` and `游2` are **in-game sightseeing identifiers**, not real Shanghai service numbers. Display only stops actually served by each game loop. Plates align along the curb rather than projecting across the cycle lane. No real-time lights were added.

References: the user's Shanghai stop photograph; [photographs of traditional Shanghai stop plates](https://4travel.jp/travelogue/10050500). Reference photos are not copied into game assets.

## Validation limits

Desktop muted/save-free preview and isolated 844×390 / 390×844 dialogue layouts were inspected. A desktop browser with touch layout is not physical-phone GPU testing. Embedded-browser samples were throttled near one frame per second, so they cannot establish foreground FPS; CPU phase observations and deterministic regressions are reported separately. Keep the satisfactory textures, city density and lighting instead of silently reducing visual quality. Player construction, save schema, existing update notices and hosting storage bindings are unchanged.
