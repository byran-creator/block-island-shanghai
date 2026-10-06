# Shanghai city expansion, version 14

This is a playable voxel interpretation, not a survey model. East is +x and south is +z. Distances and heights are compressed; the tower triangle from map revision 5 stays fixed. Real frontage order and street function guide the layout. Suzhou Creek is outside this update.

## Sources used

- Shanghai municipal government, Nanjing Road Pedestrian Precinct Management Measures: the pedestrian segment runs from Zhongshan East First Road to Xizang Middle Road. https://www.shanghai.gov.cn/nw12344/20220127/4d4d52f387ea43909221b0f7c82dbfe9.html
- Shanghai cultural and tourism bureau, seven Bund walks: Peace Hotel south wing at Bund 19 and the second frontage behind the waterfront, down to East Yan'an Road. https://whlyj.sh.gov.cn/gqfc/20250221/db645ed1893344389e44078b95440bdd.html
- Fairmont Peace Hotel, official location, Nanjing East Road 20. https://www.fairmont.com/zh/hotels/shanghai/fairmont-peace-hotel/location-contact.html
- Bund frontage address sequence: https://zh.wikipedia.org/wiki/%E5%A4%96%E6%BB%A9
- Shanghai exhibition industry public information platform, International Convention Center adjacent to the Oriental Pearl. https://expo.sww.sh.gov.cn/browser/detail.jspx?code=402881e144722a710144762b4a07000c
- Shanghai official tourism portal, Pudong Shangri-La on the Huangpu riverfront. https://www.meet-in-shanghai.net/en/hotels/pudong-shangrila-shanghai-651072/
- Aerial reference viewed: https://ak-d.tripcdn.com/images/1lo0u12000fs42zni7820.jpg
- Bund golden-lighting reference viewed: https://www.ourchinastory.com/cn/10477/

## Layout and behavior

Nanjing East Road goes through the Peace Hotel north/south gap; Beijing, Dianchi, Jiujiang, Hankou, Fuzhou, Guangdong and Yan'an streets connect the west-bank roads in north-to-south order. Traffic loops use arc-length movement and continuous lane directions across the closing seam. The bridge circuit includes both city shores, rather than turning around on the ramp. The diving pier, personal island and three parkour courses remain accessible.

The expansion adds city blocks and landmark-inspired companion towers on the east shore, low-rise rear streets on the west shore, walking and photographing visitors, white cumulus clouds, and automatic warm lighting over the historic stone facades. Generic infill models are not exact reconstructions of individual real buildings.

Static street/facade geometry is merged by material to reduce WebGL draw calls. The real CanvasRenderer fallback supports reproducible visual review; the local development server is also available for browser playtesting.

## Front-wing correction, version 14

The v13 city touched z=0. Extending the world's minimum x/z to -160 (maximum remains 400) keeps all prior coordinates intact, while adding continuous land north and west. The river bends through this extension with both shores still separated. New north-front Pudong blocks and North Bund / west rear blocks fill the previously empty views around the Oriental Pearl; all 75 v13 plot records are regression-tested unchanged. New loops join the previous networks without terminating at the city edge. Filling blocks use reference-guided urban massing, not individually surveyed towers.

The local development server now provides disk-backed snapshots in `.local-data/saves.json`, separate from online account saves. Production authentication and storage are unchanged. Signed voxel coordinates are accepted in both save backends.

## Local architecture and river-width refinement, 2026-10-03

References visually inspected for this local update:

- Shanghai Science and Technology Commission, Lujiazui aerial photograph: https://stcsm.sh.gov.cn/kcb/sfqszn/xwbd/20240410/bbf9c486116344de9b4dc3fce99d4393.html — broad river bend, varied glass towers, low convention-center massing and planted waterfront. Image: https://stcsm.sh.gov.cn/cmsres/36/36cdc99d501945ebb57ac2e70438ce41/c4ca4238a0b923820dcc509a6f75849b.png
- Kankan News aerial photograph of the Bund, reproduced in the report on waterfront outdoor spaces: https://news.sina.cn/znl/2026-02-26/detail-inhpcyyh4352408.d.html — continuous historic frontage, red and gray rear roofs, terraces, and taller commercial buildings further inland. Image: https://n.sinaimg.cn/spider20260226/400/w1280h720/20260226/baf3-63e22602a2f3b0d02618a0eec7b6f978.png
- Shanghai official tourism portal, architecture around the Bund Origin: https://www.meet-in-shanghai.net/cn/guide/a-microtrip-that-will-take-you-to-check-in-the-good-places-along-the-suzhou-creek-195583/ — brick/stone contrasts, pitched roofs and historical facade details.

`city-architecture.js` assigns stable, plot-specific profiles. Historic rear blocks mix low-rise lanes, warehouse roofs, terraces, courtyard skylights and Art Deco setbacks. Modern blocks use slabs, setbacks, chamfered corners, recessed facades, lantern crowns and sloped upper volumes. Glass colors, floor spacing and occupied night windows vary per plot; IFC companion towers keep a paired form. Facade runs follow the voxel cross sections, including the recesses, rather than wrapping every building in one rectangular panel. Original building records, street/traffic routes, tower coordinates and save schema remain unchanged. These are reference-guided voxel interpretations, not surveyed individual reconstructions.

The channel extends from `riverCenter - 18` to `riverCenter + 9`, approximately 27–28 voxel columns instead of 18–19. Its added width comes from the old west-bank apron; the eastern shoreline and landmark plazas stay fixed. The west promenade moves nine columns back while preserving the road and a continuous paved walking area. Previous ordinary promenade save positions remain supported. Existing boardwalks and bridge structures still cross the river. Local regression checks cover the excavated strip, promenade support, old standing positions, shape differences at equal height, every lobby, complete traffic laps, bridge walking and disk save persistence. This update is for local development only.

## Local map revision 8: southeast density, broad river and occupied windows

The aerial references above guide a continuous low historic frontage and a mix of older mid-rise blocks and occasional modern offices further inland, on both the north and south sides. Height is now determined by depth into the west city and a stable plot seed instead of making the entire northern half high-rise. The previous 27–28-column experiment is superseded: the river now spans `riverCenter - 74` through `riverCenter + 9`, about 83–84 columns. West-bank buildings, streets, trees and promenade move west by 56 columns; the west bridge approach is lengthened. East landmarks and island coordinates stay fixed. Minimum world coordinate becomes -224 to retain the translated western blocks. Visible shore terrain is loaded alongside distant facades so roads and trees retain their ground.

Additional primary references:

- Sun Hung Kai Properties, Shanghai IFC: twin office towers, retail mall, serviced residences and hotel, with Century Avenue location. https://www.shkp.com/en-US/our-business/mainland-and-other-properties/shanghai-ifc
- IFC Residence official site: serviced apartments in the IFC complex. https://www.ifcresidence.com/zh_CN/
- SOM, Jin Mao Tower: mixed office and hotel tower. https://www.som.com/projects/jin-mao-tower/
- Shanghai World Financial Center official building overview: https://swfc-shanghai.com/up_pdf/1321341936_50521.pdf

Southeast additions include low retail massing for IFC and the landmark tower podiums, an IFC-inspired residence, and smaller business parcels. The second parallel Century Avenue diagonal is consolidated into the existing arterial; Pudong road widths reduce by one column on each side. These are compressed, reference-guided volumes, not exact parcel reconstructions.

Windows use stable room occupancy groups, with different evening and late-night rates for offices, housing, hotels and retail. The actual merged meshes retain those groups instead of entering a single night-visible material batch. Evening occupancy is roughly 43% over the generated windows, falling substantially after midnight. Selected architectural outlines and waterfront safety lamps remain lit. Old revision 6/7 snapshots migrate west-bank positions, custom blocks, furniture, chest contents and home together in memory; capture writes revision 8. Automated checks cover migration without mutating originals, river clearance, continuous bridges and traffic, all entrances, north/south height balance, occupancy stability and visibility after geometry batching. All work remains local.

## Local map revision 9: continuous streets, landmark placement and dining

The same aerial references guide this refinement. Shanghai Tower moves five columns east and six south, reducing its exaggerated westward offset from Jin Mao and placing it farther behind the riverfront group. Entrances, elevators, observation decks and old saved contents follow the move. The original three-tower plot clearances remain fixed during legacy parcel generation so unrelated existing buildings do not disappear.

The Pearl-side duplicate road loop is retired; its shared traffic samples now follow the east business loop. Smaller commercial parcels fill available space without covering landmark entrances or the central green. Nanjing Road extends west with inward-facing shop doors on both sides. Existing placeholders in the pedestrian corridor are removed; additional low and mid-rise historical blocks fill rear and northern Bund gaps. These are compressed interpretations of local building types; named examples are not claims of exact surveyed footprints.

Primary references for the street and restaurant details:

- Shanghai official tourism, Nanjing East Road business district and historical department stores: https://www.meet-in-shanghai.net/cn/shopping/nanjing-east-road-business-district-560184/
- Shanghai municipal government, pedestrian-street boundaries including buildings on both sides: https://www.shanghai.gov.cn/nw12344/20220127/4d4d52f387ea43909221b0f7c82dbfe9.html
- Shanghai Housing Administration, historical building entries including Meilun, Xinkang and Zhongshi: https://fgj.sh.gov.cn/yxlsjzcs/20200414/b9946bf8508e4b9689671fcd4146bb86.html
- Fairmont Peace Hotel, Dragon Phoenix restaurant on the eighth floor, red columns, Shanghai cuisine and river views: https://www.fairmont.com/en/hotels/shanghai/fairmont-peace-hotel/dining/dragon-phoenix.restaurant.html

The hotel lobby lift connects to a playable dining room. A clear aisle reaches the counter, scaled tables have walking collision, and ordering grants food with a persisted 45-second interval. Automated checks cover pedestrian frontage and passage, traffic loops, supported landmark decks, unchanged source snapshots during migration, hotel entry, lift travel, menu operation, food effects and dining persistence. In-browser review uses the actual game scene with save writes disabled; temporary review code is removed after screenshots. No online publication is performed.

## Local revision 10: two-view skyline correction and street life

The user's supplied frontal and northern skyline photographs are the visual acceptance references. The old layout incorrectly placed SWFC northeast of Jin Mao. The corrected compressed group places SWFC southeast, Shanghai Tower farther south, and increases the separation from the Pearl. At the fixed frontal view the bearings order Pearl, Jin Mao, SWFC, Shanghai Tower; at the fixed northern view they order SWFC, Jin Mao, Shanghai Tower, Pearl. IFC and foreground infill heights are reduced to stop them masking the landmark crowns. Heights use approximately 0.175 game columns per real meter; the Pearl spire is now taller than Jin Mao. Existing observation platforms remain playable. The previous coordinates are migrated once with saved contents and furniture, without changing original snapshots.

Additional primary references:

- SWFC official location map: https://swfc-shanghai.com/pdf/swfc_project_brochure_cn.pdf (search-index map description; the full PDF could not be fetched during this run). The supplied photographs and consistent OSM-derived building centers corroborate the corrected triangle.
- IFC architects Pelli Clarke & Partners: north tower 260 m, south tower 250 m. https://pcparch.com/work/shanghai-ifc
- SOM, Sinar Mas Centre / White Magnolia Plaza: curved 320 m main office tower, hotel and mixed-use riverfront complex. https://www.som.com/projects/sinar-mas-centre-formerly-white-magnolia-plaza/
- Hongkou official description: seven-petal white tower crown and rooftop helicopter platform. https://www.shhk.gov.cn/xwzx/002008/002008040/20231221/5a94926f-1ab6-426f-9486-8bd80efdcb69.html
- Shanghai official tourism, Dongjin passenger ferry between Jinling East Road and Dongchang Road: https://www.meet-in-shanghai.net/tc/traffic/dock-506684/

`city-activity.js` adds both-sided vertical advertisements, shop fascia and rooftop lettering, a small number of colored shop lights, street stalls, shopping-bag visitors and eating gestures. Night neon is separate from window occupancy. Ferries dwell at each shore, cross a continuously water-safe path and carry the player until automatic disembarkation. Transit snapshots use a supported shore position. The Magnolia roof has a supported H landing deck and a parked helicopter; it is accessible via the existing elevator system. Day palettes mix stone, brick and cool glass on both banks; historical facade wash opacity is reduced instead of turning all west-bank walls gold.

Regression checks cover actual supported landings and roof, full ferry phases, both-view bearings, source snapshot preservation, market ordering/cooldown/persistence, both-side signage, tourist positions, bridge and vehicle loops, and sparse merged night windows. Local screenshots are made with production scene code and save writes disabled.

The North Bund menu shortcut reaches the supported west-bank point (145.5, -130.5). Clear-weather fog extends to 440 columns so the distant trio remains readable from this viewpoint; fog and rain retain reduced visibility. The saved frontal and northern screenshots show the same production geometry without moving individual landmarks for either camera.
