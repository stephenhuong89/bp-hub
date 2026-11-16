/* LTA data set: street works and access, vehicle parking, railway protection, road structures and works on public streets.
   Researched 17 Nov 2026 from LTA's codes of practice, read from the PDFs:
   Street Work Proposals (Version 2.0, April 2019), Vehicle Parking Provision (2019 Edition), Railway Protection (2024 Edition with the September 2026 addendum),
   Works on Public Streets (April 2026), the Road Structure Safety Zone Guide (January 2011), the TIA Guidelines (2019) and LTA's fee schedule.
   The statute website could not be read, so penalties under the Street Works Act and the Rapid Transit Systems Act are marked unverified. */
(function () {
  "use strict";
  var L = "https://www.lta.gov.sg/content/dam/ltagov/industry_innovations/industry_matters/development_construction_resources/";
  var S = {
    rt: L + "Street_Work_Proposals/codes_of_practice/RT-COP_V2.0_April_2019.pdf", vp: L + "Vehicle_Parking_Proposals/COP_on_Vehicle_Parking_Provision_in_Development_Proposals-2019_Edition.pdf",
    rp: L + "Building_Works_Restricted_Activities_in_Railway_Protection_Zone/Codes_of_Practice_Standards_Specifications_Guides_Forms/code_of_practice_for_railway_protection_2024_edition.pdf",
    rpadd: L + "Building_Works_Restricted_Activities_in_Railway_Protection_Zone/Codes_of_Practice_Standards_Specifications_Guides_Forms/circular_enhanced_rails_cop.pdf",
    dbw: L + "Building_Works_Restricted_Activities_in_Railway_Protection_Zone/Codes_of_Practice_Standards_Specifications_Guides_Forms/topic_1_dbw_regs_final.pdf",
    rpra: L + "Building_Works_Restricted_Activities_in_Railway_Protection_Zone/Codes_of_Practice_Standards_Specifications_Guides_Forms/topic_2_rpra_regs_final.pdf",
    rssz: L + "Street_Work_Proposals/Guidelines/Road_Structure_Safety_Zone_Guide.pdf", tia: L + "Street_Work_Proposals/Guidelines/TIA_Guidelines_WCP_Final_07Dec2018.pdf",
    wps: L + "Street_Work_Proposals/codes_of_practice/Code_of_Practice_for_Works_on_Public_Streets_Apr_2026.pdf", fees: L + "pdf/service_standard_and_fees_schedule.pdf",
    ev: "https://www.lta.gov.sg/content/ltagov/en/industry_innovations/technologies/electric_vehicles/transitioning_to_evs.html", cx: "https://www.ura.gov.sg/guidelines/circulars/dc26-08/",
    swa: "https://sso.agc.gov.sg/Act/SWA1995", rtsa: "https://sso.agc.gov.sg/Act/RTSA1995", road: "https://www.lta.gov.sg/content/ltagov/en/who_we_are/our_work/road.html",
    sink: "https://www.lta.gov.sg/content/ltagov/en/newsroom/2026/6/news-releases/joint-news-release-by-the-land-transport-authority--lta---bca---.html",
    verge: "https://www.mot.gov.sg/news-resources/newsroom/reports-of-unauthorised-works-on-lta-managed-state-land-fronting-private-properties-in-past-three-years-and-policy-on-cost-liability-of-restoration-works/",
    nicoll: "https://en.wikipedia.org/wiki/Nicoll_Highway_collapse"
  };
  var RT = "Code of Practice on Street Work Proposals, V2.0 (2019), ", VP = "Code of Practice on Vehicle Parking Provision, 2019 Ed, ", RP = "Code of Practice for Railway Protection, 2024 Ed, ", WPS = "Code of Practice for Works on Public Streets, April 2026, ";

  var rules = [
    /* street works and access */
    ["a-low", "street", "Access", "verified", "Access from the lowest category of road", "The access point goes on the lowest category of road fronting the site. There is no direct access from an expressway, a major arterial road, a slip road, an acceleration or deceleration lane, or a bus or taxi bay.", "Road category of each frontage and where the access is drawn.", RT + "Ch 4", S.rt],
    ["a-30", "street", "Access", "verified", "30 m from junctions, bends, crossings and bus stops", "An access is at least 30 m from a road junction, a road bend, a pedestrian crossing, a bus stop and an access on the opposite side.", "Dimension from the access to the nearest junction, crossing and bus stop.", RT + "Ch 4", S.rt],
    ["a-one", "street", "Access", "verified", "One access per development", "Each development has one access point unless there is a good technical reason. A residential development of more than 600 units may be considered for a second access from another road.", "Number of accesses on the site plan.", RT + "Ch 4", S.rt],
    ["a-landed", "street", "Access", "verified", "Landed house accesses", "Accesses to landed houses are at least 6 m apart, or paired.", "Spacing between neighbouring accesses.", RT + "Ch 4", S.rt],
    ["a-width", "street", "Access", "unverified", "Recommended access widths", "LTA's table gives 3.0 to 4.5 m for a landed house with a frontage under 8 m and up to 5.5 m beyond that, 11 to 13 m for flats and condominiums with a 3 m island, 6 to 10 m for commercial developments, and 8 to 15 m for industrial ones. The table did not read cleanly, so check it before quoting.", "Access width and kerb radius.", RT + "Table 4.1", S.rt],
    ["a-grad", "street", "Access", "verified", "Entrance driveway gradient", "The entrance driveway is not steeper than 1 in 10.", "Levels at the boundary and at the top or bottom of the driveway.", RT + "Ch 4", S.rt],
    ["a-queue", "street", "Access", "verified", "Queue space inside the site", "There must be enough storage length inside the site before the gate or barrier. A residential development needs queue space or a holding bay for at least 2 vehicles.", "Distance from the boundary to the gate or barrier.", RT + "Ch 4", S.rt],
    ["a-barrier", "street", "Access", "verified", "Drop barriers and left-in, left-out", "In a commercial development the drop barriers, including those to loading bays, are placed away from the access at the car park levels. An entrance on a major arterial road is left-in, left-out.", "Barrier positions and the turning movements shown at the access.", RT + "Ch 4", S.rt],
    ["a-sight", "street", "Access", "verified", "Sight lines at the access", "Boundary walls and fences are set back or made porous so that drivers can see pedestrians. No numeric sight distance was found for this hub.", "Boundary wall treatment beside the access.", RT + "Ch 4", S.rt],
    ["a-splay", "street", "Frontage", "verified", "Splay corners", "At a road intersection the corner is splayed 9 m by 9 m for industrial roads, 6 m by 6 m where a residential road meets a Category 4 road or higher, and 3 m by 3 m for other residential and service roads.", "Corner splay dimensions on the site plan.", RT + "Ch 2", S.rt],
    ["a-side", "street", "Frontage", "verified", "Footpath, cycling path and covered linkway", "A footpath is 1.8 m wide. Where there is a cycling path it is 2.0 m in a town or 2.5 m between towns, beside a 1.5 m footpath. A covered linkway is 2.4 m, or 3.6 m near an MRT station.", "Widths of the footpath, cycling path and linkway along the frontage.", RT + "Table 2.4", S.rt],
    ["a-culvert", "street", "Frontage", "verified", "Entrance culvert", "The top of the culvert is flat across. Tactile tiles are placed 300 mm from the driveway. Where the footpath is steeper than 1 in 12 it needs a railing or a surface treatment.", "Culvert section and tactile tile positions.", RT + "Ch 4", S.rt],
    ["a-vest", "street", "Frontage", "verified", "Road reserve and vesting", "Where a road reserve line cuts the site, the developer sets the boundary back, rebuilds the culvert and drain to the line, and vests the land in the State free of encumbrances and without payment, before CSC.", "Road reserve line, the new boundary and the land to be vested.", RT + "Ch 2", S.rt],
    ["a-bridge", "street", "Frontage", "verified", "Structures under or near a bridge", "A structure is at least 5 m from any bridge column, pier or abutment, with at least 2.5 m of clearance above its roof, and no basement.", "Distance to bridge supports and the roof level.", RT + "1.7.3", S.rt],
    /* parking */
    ["p-lot", "park", "Lots", "verified", "Car parking lot size", "A car lot is 2.4 m by 4.8 m, and a parallel lot is 5.4 m long. The lot is flat and free of kerbs. It widens to 2.7 m with an obstruction on one side and 3.0 m with obstructions on both, and the last lot in a dead-end aisle is 3.0 m.", "Lot dimensions, and lots beside columns or walls.", VP + "2.1.1", S.vp],
    ["p-aisle", "park", "Lots", "verified", "Parking aisle width", "For 90-degree parking the aisle is 6.0 m one-way and 6.6 m two-way. At 60 degrees, 4.8 m and 6.6 m. At 45 degrees, 4.8 m with bays on both sides and 6.3 m two-way. At 30 degrees, 4.2 m and 6.3 m. For parallel parking, 3.6 m and 6.0 m.", "Aisle width against the parking angle and traffic direction.", VP + "2.1.2", S.vp],
    ["p-ramp", "park", "Ramps", "verified", "Ramps and accessways", "A straight single-lane ramp is 3.6 m wide, or 3.0 m a lane where there are several. A curved one is 4.2 m with an inside radius of at least 4.5 m. The gradient is preferably 1 in 10 and never steeper than 1 in 8.3, with transitions at the floor levels.", "Ramp width, inside radius and gradient with transition lengths.", VP + "2.1.3, 2.1.4", S.vp],
    ["p-floor", "park", "Ramps", "verified", "Sloping floors with parking", "A sloping floor with lots on it is preferably 1 in 25 and never steeper than 1 in 20.", "Gradient of any parking floor.", VP + "2.1.4", S.vp],
    ["p-head", "park", "Lots", "verified", "Car park headroom", "Headroom is at least 2.2 m, measured to the underside of beams, signs, sprinklers and other fittings.", "Clear height under the lowest fitting.", VP + "2.1.5", S.vp],
    ["p-heavy", "park", "Heavy vehicles", "verified", "Heavy vehicle lots", "A rigid vehicle under 7.5 m needs a lot of 7.5 m by 3.0 m, a longer rigid vehicle 12.0 m by 3.3 m, and an articulated vehicle 14.0 m by 3.3 m. Headroom is 4.2 m, or 4.5 m for articulated vehicles and 4.75 m on their ramps. Ramps are no steeper than 1 in 12 for rigid and 1 in 15 for articulated vehicles.", "Lorry lot sizes, headroom and ramp gradient.", VP + "2.2", S.vp],
    ["p-moto", "park", "Lots", "verified", "Motorcycle lot", "A motorcycle lot is at least 0.8 m by 2.4 m, and preferably 1.0 m by 2.5 m.", "Motorcycle lot dimensions.", VP + "2.3", S.vp],
    ["p-num", "park", "Numbers", "verified", "Number of car lots within the range", "The number of lots must fall between a lower and an upper bound that depend on the use and the zone. Zone 1 is the city and Marina Bay, Zone 2 is within 400 m of an MRT or LRT station, and Zone 3 is the rest. Below the lower bound needs LTA's review and a deficiency charge. Each use is rounded before adding.", "Parking calculation by use and zone against the lots provided.", VP + "Ch 1, Table 1", S.vp],
    ["p-bike", "park", "Numbers", "verified", "Bicycle parking", "A residential development provides 1 bicycle lot for every 4 dwelling units in Zones 1 and 2, and 1 for every 6 in Zone 3. Offices and shops follow LTA's bicycle parking matrix from 1,000 m² of GFA.", "Bicycle lot count and location.", VP + "Table 1, Table 2", S.vp],
    ["p-ev", "park", "Numbers", "verified", "Electric vehicle charging", "A new or rebuilt building provides at least 1.3 kVA of electrical capacity for every car and motorcycle lot, with chargers installed for at least 20% of that load. Chargers are not required where there are fewer than 8 lots.", "Electrical provision and charger positions on the parking plan.", "Electric Vehicles Charging Act 2022, per LTA", S.ev],
    ["p-col", "park", "Lots", "verified", "Columns and obstructions", "Columns and other obstructions are shown on the plans and may not reduce any of the minimum dimensions.", "Columns drawn on the car park plan.", VP + "Ch 2", S.vp],
    /* railway protection */
    ["r-zone", "rail", "Zone", "verified", "The railway protection zone", "The zone runs 40 m from the outermost edge of any part of a railway, whether above, on or below the ground. Inside it, written permission from LTA is needed before restricted activities start: cranes, boreholes, piles and anchors, trenches and earthworks, storage, temporary structures and scaffolds.", "The 40 m line from the railway structure on the site plan.", RP + "1.2", S.rp],
    ["r-move", "rail", "Limits", "verified", "Allowable movement of the railway", "Total movement of the structure is limited to 15 mm. Differential movement is limited to 15 mm or 1 in 1,000, whichever is less, for bored tunnels on the main lines. An above-ground station is limited to 5 mm of differential movement.", "Predicted movements in the engineering evaluation report.", RP + "Table 2(b)", S.rp],
    ["r-vib", "rail", "Limits", "verified", "Vibration at the railway", "Peak particle velocity may not exceed 15 mm/s.", "Vibration limit in the method statement.", RP + "3.1.4", S.rp],
    ["r-pile", "rail", "Works", "verified", "Piling near a railway", "Piling is not allowed in the first reserve. In the second reserve next to an underground railway, piles keep 6 m clear on plan, are bored or augered only, and are debonded. Percussive, driven and vibratory methods and rock-chopping chisels are prohibited.", "Pile positions against the reserve lines, and the piling method.", RP + "Table 3", S.rp],
    ["r-anchor", "rail", "Works", "verified", "Ground anchors near a railway", "Ground anchors and tie-backs are not allowed in the first or second reserve of an underground or at-grade railway.", "Any anchors drawn towards the railway.", RP + "Table 4", S.rp],
    ["r-gw", "rail", "Limits", "verified", "Groundwater near a railway", "In compressible soil in the first and second reserves, the piezometric pressure may not be reduced by more than 10 kPa.", "Groundwater control and recharge in the excavation design.", RP + "3.2", S.rp],
    ["r-inst", "rail", "Monitoring", "verified", "Instrumentation and trigger levels", "The qualified person proposes an alert level and a work suspension level from the predicted movements. Instruments are calibrated every 6 months. The code does not fix the trigger values.", "Instrumentation plan with both trigger levels stated.", RP + "4.5, 6.4", S.rp],
    ["r-crane", "rail", "Works", "verified", "Cranes within 6 m of a railway", "Since 2021 a crane may work within 6 m of the railway edge only with LTA's special approval and extra safety measures. LTA's approval letter states whether the works are inside or outside 6 m.", "Crane positions and swing radius against the 6 m line.", "LTA briefing on the 2021 Railway Protection Regulations", S.rpra],
    ["r-soft", "rail", "Monitoring", "unverified", "Bored tunnels in soft ground", "An addendum of September 2026 requires a consolidation analysis for works beside bored tunnels in compressible soils, with monitoring points every 3 m along the tunnel and extending 20 m beyond the zone of influence. Its circular gives two different effective dates.", "Consolidation analysis and tunnel monitoring layout.", RP + "Addendum Sept 2026, s 3.5", S.rpadd],
    /* road structures and public streets */
    ["s-rssz", "road", "Road structures", "unverified", "Road structure safety zone", "The zone runs 20 m from the outermost edge of a bridge, viaduct, road tunnel, underpass or retaining wall. Engineering works inside it need LTA's approval first, applied for by a PE: basement excavation, piles, boreholes, ground anchors, and any crane or heavy equipment.", "The 20 m line from the road structure.", "Street Works Act 1995 s 8A; Road Structure Safety Zone Guide, 2011", S.rssz],
    ["s-tech", "road", "Road structures", "verified", "Limits at a road structure", "Vibration is limited to 15 mm/s. The toppling zone of any equipment is at least 6 m clear of the road structure. Surcharge over a road tunnel is limited to 15 or 25 kN/m² depending on the tunnel.", "Crane toppling zone and surcharge over any tunnel.", "Road Structure Safety Zone Guide, 2011, s 6", S.rssz],
    ["s-adj", "road", "Public streets", "verified", "Excavation beside a public street", "LTA must be notified at least 10 working days before an excavation deeper than 1.5 m within twice its depth of the street edge, or tunnelling, boreholes, piling or anchors within 20 m of it.", "Excavation depth and its distance from the street edge.", "Road Structure Safety Zone Guide, 2011", S.rssz],
    ["s-reinst", "road", "Public streets", "verified", "Reinstating a road opening", "The road is milled and patched at least 50 mm thick across the full lane width. Openings less than 30 m apart are joined. A footpath is reinstated across its full width for at least 1 m.", "Reinstatement extent on the road opening plan.", WPS + "8.2", S.wps]
  ].map(function (r) { return { id: "lta-r-" + r[0], kind: "rule", scope: r[1], agency: "LTA", topic: r[2], status: r[3], title: r[4], body: r[5], evidence: r[6], ref: r[7], src: r[8] }; });

  var process = [
    ["stages", "Street work stages", "A layout plan comes first, then street plans, then CSC clearance for the completed works. A new street, road widening, pedestrian overhead bridge or underpass follows a stricter track with a street works deposit.", RT + "Ch 1", S.rt, "verified"],
    ["rail-stages", "Railway protection stages", "A development proposal is needed for every development in the zone and is valid for 24 months. Where there are building works, a building proposal follows within 12 months, then a permit to carry out engineering works, then CSC clearance.", "LTA briefing on the 2021 Regulations", S.dbw, "verified"],
    ["rail-who", "Who signs for railway protection", "The qualified person appointed by the developer makes and signs each application. A PE supervises the engineering works, with a PE (Geo) for basement excavation. A registered surveyor certifies the survey plan for piling, tunnelling or basements in the first reserve.", RP + "1.3, 1.4", S.rp, "verified"],
    ["rail-pack", "What the permit application contains", "The plan of the engineering works, an engineering evaluation report, an instrumentation proposal, a method statement, a contingency plan and a pre-condition survey. No engineering work starts without LTA's written permission.", RP + "4.2.2", S.rp, "verified"],
    ["lodge", "Lodgement for low-risk works near a railway", "Works with no basement on a site whose boundary is more than 20 m from the railway structure may be lodged with a self-declaration, and LTA acknowledges within 3 working days. A false declaration revokes it.", "LTA briefing on the 2021 Regulations", S.dbw, "verified"],
    ["time", "LTA's service standard", "20 working days for a straightforward submission with complete information.", "LTA service standard and fees schedule", S.fees, "verified"],
    ["resub", "Resubmission fees", "The first three submissions are free. From the fourth, each costs S$1,200 for layout and street plans involving a new street, road widening, bridge or underpass, and S$300 for other street works, vehicle parking and every railway or road structure protection stage.", "LTA service standard and fees schedule", S.fees, "verified"],
    ["pfee", "Parking plan fee and deficiency charge", "The parking plan fee is S$10 per 100 m² of GFA, with a minimum of S$120. A shortfall below the lower bound is charged at S$16,000 a car lot, S$5,500 a motorcycle lot and S$40,000 a lorry lot. The charges are from the 2019 code and may have changed.", VP + "Ch 1; LTA fees schedule", S.vp, "verified"],
    ["tia", "When a transport impact assessment is needed", "A TIA and a walking and cycling plan are prepared before development control for 700 or more private homes, 1,000 or more HDB flats, 10,000 m² of retail, 20,000 m² of office, 700 hotel rooms, 60,000 m² of light or general industry, or 50,000 m² of warehousing.", "LTA TIA Guidelines, 2019 Edition, Annex A", S.tia, "verified"],
    ["mep", "Maintenance period and deposit", "New streets, underpasses and pedestrian bridges carry a one-year maintenance period from CSC clearance. LTA keeps part of the street works deposit: 10% or S$20,000, or 5% or S$100,000 where the deposit exceeds S$1 million.", RT + "Ch 6", S.rt, "verified"],
    ["prompt", "Road opening permits", "Any works on a public street need LTA's approval, applied for through LTA.PROMPT by a registered contractor. A newly resurfaced road may not be opened for 1 year, and a new or upgraded road for 2 years. Lanes may not be occupied in the morning and evening peaks.", WPS + "definitions, 6.10", S.wps, "verified"],
    ["dlp", "Defects liability for a road opening", "One year where the excavation is 1.5 m deep or less, and two years where it is deeper, starting when LTA accepts the permanent reinstatement.", WPS + "4.10", S.wps, "verified"],
    ["pen-swa", "Penalties under the Street Works Act", "Works on a public street need LTA's prior approval. Failing to comply with LTA's order carries a fine of up to S$100,000 and S$1,000 a day. Engineering works in a road structure safety zone without approval carry up to S$5,000 and S$100 a day.", "Street Works Act 1995 ss 8A, 17", S.swa, "unverified"],
    ["pen-rts", "Penalties under the Rapid Transit Systems Act", "Wilfully damaging a railway carries a fine of up to S$200,000, 12 months' jail, or both, with compensation on top. Wilfully endangering safety carries up to 5 years' jail.", "Rapid Transit Systems Act 1995 ss 25 to 27", S.rtsa, "unverified"],
    ["cx", "CORENET X", "New projects of 5,000 m² GFA and above use the gateways from 1 October 2026. Street and parking layout is cleared at the Design Gateway, street plans and parking plans at the Construction Gateway, and railway building proposals at construction stage.", "URA circular DC26-08", S.cx, "unverified"]
  ].map(function (r) { return { id: "lta-" + r[0], kind: "rule", scope: "sub", agency: "LTA", topic: "Process", status: r[5], checkable: false, title: r[1], body: r[2], ref: r[3], src: r[4] }; });

  var terms = [
    ["t-rpz", "Railway protection zone (RPZ)", "The area within 40 m of any part of a railway in operation. Works inside it need LTA's permission.", RP + "1.2", S.rp],
    ["t-res", "First, second and third reserve", "Bands around a railway structure, tightest nearest to it. The first reserve is about 6 m either side. What may be built in each is set out in the code's tables and figures.", RP + "Tables 3, 4", S.rp],
    ["t-rssz", "Road structure safety zone (RSSZ)", "The area within 20 m of a bridge, viaduct, road tunnel, underpass or retaining wall.", "Road Structure Safety Zone Guide, 2011", S.rssz],
    ["t-cat", "Road category", "Roads are classed from Category 1, expressways, to Category 5, local access roads. The category decides where an access may go.", RT + "Ch 2", S.rt],
    ["t-rrl", "Road reserve line", "The line to which the road may one day be widened. Land beyond it on the road side is vested in the State.", RT + "Ch 2", S.rt],
    ["t-range", "Range-based parking standards", "A lower and an upper bound on the number of parking lots, by use and zone, in force since February 2019.", VP + "Ch 1", S.vp],
    ["t-tia", "Transport impact assessment (TIA)", "A traffic consultant's study of the traffic a large development will add, with a walking and cycling plan.", "LTA TIA Guidelines, 2019", S.tia],
    ["t-prompt", "LTA.PROMPT", "LTA's portal for permits to open and occupy public streets.", WPS, S.wps],
    ["t-lilo", "Left-in, left-out (LILO)", "An access where vehicles may only turn left to enter and left to leave.", RT + "Ch 4", S.rt]
  ].map(function (t) { return { id: "lta-" + t[0], kind: "term", agency: "LTA", status: "verified", title: t[1], body: t[2], ref: t[3], src: t[4] }; });

  function opt(id, label, qp, verdict, vlabel, basis, detail, ref, src, tags) { return { id: id, label: label, qp: qp, verdict: verdict, vlabel: vlabel, confidence: "High", basis: basis, detail: detail, ref: ref, src: src, tags: tags }; }
  var Z = { res: [[2, 1.25], [1.25, 1], [1.25, 1]], office: [[950, 590], [530, 330], [260, 210]], shop: [[840, 530], [420, 210], [200, 160]], fact: [[460, 370], [460, 370], [460, 370]] };

  window.LTADATA = {
    meta: { asOf: "17 Nov 2026", setName: "LTA street works, parking and railway protection submission", note: "Internal reference for CVC Engineers. It summarises published rules and is not legal advice or an authority decision; the qualified person remains responsible for every submission." },
    synonyms: { rpz: ["railway protection zone", "railway protection"], rssz: ["road structure safety zone"], tia: ["transport impact assessment"], wcp: ["walking and cycling plan"], lilo: ["left-in left-out"], ev: ["electric vehicle"], mep: ["maintenance period"], qp: ["qualified person"], mrt: ["railway", "rts"] },
    who: {
      buckets: [["pe", "Lodge or notify", "Low-risk works"], ["either", "LTA clearance", "Submitted by the qualified person"], ["architect", "Approval with specialists", "Near a railway or a road structure"]],
      headlineHtml: '<div class="note bad"><b>Check two distances before design: 40 m from any railway and 20 m from any bridge, viaduct or road tunnel.</b> Inside either, no engineering work starts without LTA\'s written permission.</div><div class="panel"><h3>Three submissions</h3><div class="prose"><ul><li><b>Street works:</b> where the access goes, what is built along the frontage, and land vested for road widening.</li><li><b>Vehicle parking:</b> how many lots, and the bay, aisle and ramp dimensions.</li><li><b>Railway and road structure protection:</b> works near an MRT or LRT line, or a bridge, viaduct or tunnel.</li></ul><p>Opening a public road is a fourth, separate permit through LTA.PROMPT.</p></div></div>',
      notesHtml: '<h3>Who signs what</h3><ul><li><b>Qualified person:</b> lodges the layout, street and parking plans.</li><li><b>Traffic consultant:</b> prepares the transport impact assessment, with the architect for the walking and cycling plan.</li><li><b>PE:</b> applies for works in a road structure safety zone, and supervises engineering works near a railway. A PE (Geo) is needed for basement excavation there.</li><li><b>Registered surveyor:</b> certifies the survey plan for works in the first reserve.</li><li><b>Registered contractor:</b> applies for the road opening permit.</li></ul>',
      options: [
        opt("access", "Any development with a vehicle access or frontage works", "Architect or PE", "either", "Layout plan, then street plans", "The access position, the culvert, footpath and any cycling path or linkway along the frontage are cleared before they are built.", "20 working days at each stage.", RT + "Ch 1", S.rt, "driveway entrance footpath"),
        opt("newst", "New street, road widening, bridge or underpass", "PE", "either", "Street plans and a deposit", "The stricter track applies, with a street works deposit and a one-year maintenance period after CSC.", "LTA keeps part of the deposit through the maintenance period.", RT + "Ch 6", S.rt, "road widening pob underpass"),
        opt("park", "Any development with parking", "Architect or PE", "either", "Parking proposal", "The parking proposal covers the whole development and is submitted after URA's approval.", "S$10 per 100 m² of GFA, minimum S$120.", VP + "Ch 1", S.vp, "car park lots"),
        opt("short", "Fewer lots than the lower bound", "Architect or PE", "architect", "LTA review and a charge", "Going below the lower bound needs LTA's review and a deficiency charge.", "S$16,000 for each car lot short, under the 2019 code.", VP + "Ch 1", S.vp, "deficiency waiver car-lite"),
        opt("tia", "Large development", "Traffic consultant", "either", "TIA and walking and cycling plan", "Needed before development control above the size thresholds, such as 700 homes or 20,000 m² of office.", "A preliminary walking and cycling plan goes in before the scoping meeting.", "LTA TIA Guidelines, 2019", S.tia, "traffic study"),
        opt("rpz", "Works within 40 m of a railway", "QP; PE to supervise; PE (Geo) for basements", "architect", "Railway protection", "A development proposal, then a building proposal and a permit to carry out engineering works.", "The railway may move no more than 15 mm.", RP, S.rp, "mrt lrt tunnel viaduct"),
        opt("rpzlow", "Low-risk works near a railway, no basement, more than 20 m away", "QP", "pe", "Lodgement", "A self-declared lodgement is acknowledged within 3 working days.", "A false declaration revokes it.", "LTA briefing on the 2021 Regulations", S.dbw, "a&a renovation"),
        opt("crane", "Crane or lifting within 6 m of a railway", "QP and the crane contractor", "architect", "Special approval", "Allowed since 2021 only with LTA's special approval and extra safety measures.", "", "LTA briefing on the 2021 Regulations", S.rpra, "lifting hoist"),
        opt("rssz", "Works within 20 m of a bridge, viaduct or road tunnel", "PE; the contractor for crane-only works", "architect", "Road structure approval", "Engineering works in the road structure safety zone need LTA's approval first.", "Crane toppling zone at least 6 m clear.", "Road Structure Safety Zone Guide, 2011", S.rssz, "flyover expressway"),
        opt("adj", "Deep excavation or piling beside a public street", "PE", "pe", "Notify 10 working days ahead", "Excavation deeper than 1.5 m within twice its depth of the street, or piling within 20 m.", "", "Road Structure Safety Zone Guide, 2011", S.rssz, "basement erss"),
        opt("open", "Digging up or occupying a public road or footpath", "Registered contractor", "either", "LTA.PROMPT permit", "Any works on a public street need LTA's approval.", "No opening for 1 year after resurfacing, 2 years after a new road.", WPS, S.wps, "road opening utility connection")
      ]
    },
    tracks: [{ id: "bld", label: "New development" }, { id: "rail", label: "Site within 40 m of a railway" }, { id: "road", label: "Works on a public street" }],
    steps: [
      { id: "t-site", col: 0, lanes: [0, 0], untimed: true, title: "Check the road and what runs nearby", tracks: ["bld", "rail", "road"], agency: "Developer", lead: "QP", status: "verified",
        what: ["Road category of each frontage and the road reserve line.", "Bus stops, crossings and junctions within 30 m.", "Any railway within 40 m, and any bridge, viaduct or road tunnel within 20 m.", "The parking zone: city, within 400 m of a station, or the rest."],
        out: ["Where the access can go, how many lots are allowed, and whether protection submissions are needed."], hurdles: ["Planning the access on the main road when a side road exists.", "Finding the railway zone after the basement is designed."],
        ask: ["What category is each road?", "How far is the nearest MRT or LRT structure?"], ref: RT + "Ch 2, 4; " + RP + "1.2", src: S.rt },
      { id: "t-tia", col: 1, lanes: [0, 0], untimed: true, title: "Transport impact assessment", tracks: ["bld"], agency: "Developer", lead: "Traffic consultant", status: "verified",
        what: ["Scoping with LTA, traffic surveys and analysis.", "Walking and cycling plan with the architect."], out: ["A TIA accepted before development control."], hurdles: ["Starting it after the layout is fixed."], ask: ["Does the development cross a threshold?"], ref: "LTA TIA Guidelines, 2019", src: S.tia },
      { id: "t-dp", col: 1, lanes: [2, 2], tatMin: 3, tatMax: 20, tatNote: "3 working days if lodged, 20 otherwise", title: "Railway development proposal", tracks: ["rail"], agency: "LTA", lead: "QP", status: "verified",
        what: ["The proposal against the railway, with a preliminary engineering assessment by a PE."], out: ["Approval, valid for 24 months."], hurdles: ["Letting it lapse before the building proposal goes in."], ask: ["Is there a basement, and is the boundary more than 20 m from the structure?"], ref: "LTA briefing on the 2021 Regulations", src: S.dbw },
      { id: "t-layout", col: 2, lanes: [2, 2], tatMin: 20, tatMax: 20, tatNote: "20 working days", title: "Layout plan clearance", tracks: ["bld"], agency: "LTA", lead: "QP", status: "verified",
        what: ["Access position and width.", "Parking numbers by use and zone.", "Frontage: footpath, cycling path, linkway, road reserve."], out: ["Clearance of the street and parking layout, at the Design Gateway under CORENET X."],
        hurdles: ["Access less than 30 m from a junction or bus stop.", "Lots outside the range with no justification."], ask: ["Is the lot count between the lower and upper bounds?"], ref: RT + "Ch 1; " + VP + "Ch 1", src: S.rt },
      { id: "t-bp", col: 3, lanes: [2, 2], tatMin: 20, tatMax: 20, tatNote: "20 working days", title: "Street plans and parking plans", tracks: ["bld"], agency: "LTA", lead: "QP", status: "verified",
        what: ["Detailed street plans: culvert, kerbs, levels, drainage.", "Parking plans: bays, aisles, ramps, headroom, columns."], out: ["Clearance, at the Construction Gateway under CORENET X."],
        hurdles: ["A column inside a parking bay.", "A ramp steeper than 1 in 8.3 or with no transition."], ask: ["Has every lot beside a wall or column been widened?"], ref: VP + "Ch 2", src: S.vp },
      { id: "t-railbp", col: 3, lanes: [2, 2], tatMin: 20, tatMax: 20, tatNote: "20 working days", title: "Railway building proposal and permit", tracks: ["rail"], agency: "LTA", lead: "QP and PE", status: "verified",
        what: ["Building proposal within 12 months of the development proposal.", "Permit package: engineering evaluation report, instrumentation, method statement, contingency plan, pre-condition survey."], out: ["Written permission to start engineering works."],
        hurdles: ["Predicted movement above 15 mm.", "Piles or anchors drawn inside the first or second reserve."], ask: ["What are the alert and work suspension levels?"], ref: RP + "4.2", src: S.rp },
      { id: "t-prompt", col: 3, lanes: [2, 2], untimed: true, title: "Road opening permit", tracks: ["road", "bld"], agency: "LTA", lead: "Registered contractor", status: "verified",
        what: ["Application on LTA.PROMPT with a traffic control plan."], out: ["A permit for the dates and lanes applied for."], hurdles: ["A road resurfaced within the last year.", "Lane closure in the peak hours."], ask: ["When was the road last resurfaced?"], ref: WPS, src: S.wps },
      { id: "t-build", col: 4, lanes: [0, 0], untimed: true, title: "Build and monitor", tracks: ["bld", "rail", "road"], agency: "Developer", lead: "Builder, PE and QP", status: "verified",
        what: ["Readings at the railway against the alert and work suspension levels.", "Critical incidents reported to LTA's operations centre within 10 minutes."], out: ["Works finished with the railway and the road undamaged."],
        hurdles: ["A crane moved inside 6 m without approval.", "A site office placed in the first reserve."], ask: ["Where are the readings against the alert level?"], ref: RP + "4.5, 4.7", src: S.rp },
      { id: "t-csc", col: 5, lanes: [2, 2], tatMin: 20, tatMax: 20, tatNote: "20 working days", title: "CSC clearance and handover", tracks: ["bld", "rail"], agency: "LTA", lead: "QP", status: "verified",
        what: ["CSC inspection of the completed street works.", "Land in the road reserve vested in the State, with the subdivision plan and certified plan."], out: ["Clearance, and the street works handed over to LTA."],
        hurdles: ["Vesting not completed.", "Works built on the road verge without approval."], ask: ["Has the land been vested?"], ref: RT + "Ch 6", src: S.rt },
      { id: "t-after", col: 6, lanes: [0, 0], untimed: true, title: "After handover", tracks: ["bld", "road"], agency: "Developer", lead: "Developer", status: "verified",
        what: ["One-year maintenance period for a new street, bridge or underpass.", "Defects liability of one or two years for a road opening."], out: ["Return of the retained deposit."], hurdles: ["Opening the new street again inside its one-year no-opening period."], ask: ["When does the maintenance period end?"], ref: RT + "Ch 6; " + WPS + "4.10", src: S.rt }
    ],
    processNotesHtml: '<h3>How to read the times</h3><ul><li>LTA\'s 20 working days is for a straightforward submission with complete information.</li><li>The first three submissions are free and the fourth is charged, so a weak first submission costs time before it costs money.</li><li>Railway protection runs alongside the street and parking submissions and has its own stages and validity periods.</li></ul>',
    fees: {
      fields: [
        { id: "gfa", label: "GFA of the development (m²)", type: "number", def: 5000 },
        { id: "dims", label: "Dimension items put up for review", type: "number", def: 0 },
        { id: "lots", label: "Lot-number items put up for review", type: "number", def: 0 },
        { id: "short", label: "Car lots short of the lower bound", type: "number", def: 0 },
        { id: "resub", label: "Fourth or later submission", type: "select", options: [["n", "No"], ["s", "Yes: parking, simple street works or railway protection"], ["l", "Yes: street plans with a new street, widening, bridge or underpass"]], def: "n" }
      ],
      items: [
        { id: "lta-park", agency: "LTA", label: "Parking plan fee", status: "verified", ref: "LTA service standard and fees schedule; " + VP, src: S.fees, desc: "$10 for each 100 m² of GFA, with a minimum of $120.",
          calc: function (p) { var n = Math.ceil((p.gfa || 0) / 100), a = Math.max(120, 10 * n); return { amount: a, basis: n + " x $10" + (a === 120 ? ", minimum $120" : "") }; } },
        { id: "lta-rev", agency: "LTA", label: "Review of a requirement", status: "verified", ref: "LTA service standard and fees schedule", src: S.fees, desc: "$80 for each layout dimension put up for review and $120 for each item on the number of lots.",
          when: function (p) { return (p.dims || 0) + (p.lots || 0) > 0; }, calc: function (p) { return { amount: 80 * (p.dims || 0) + 120 * (p.lots || 0), basis: (p.dims || 0) + " x $80 + " + (p.lots || 0) + " x $120" }; } },
        { id: "lta-def", agency: "LTA", label: "Deficiency charge", status: "unverified", ref: VP + "Ch 1", src: S.vp, desc: "$16,000 for each car lot below the lower bound, from the 2019 code. Check the current rate.",
          when: function (p) { return p.short > 0; }, calc: function (p) { return { amount: 16000 * p.short, basis: p.short + " car lot(s) x $16,000" }; } },
        { id: "lta-resub", agency: "LTA", label: "Resubmission fee", status: "verified", ref: "LTA service standard and fees schedule", src: S.fees, desc: "$300 or $1,200 for each submission from the fourth. The first three are free.",
          when: function (p) { return p.resub === "s" || p.resub === "l"; }, calc: function (p) { return p.resub === "l" ? { amount: 1200, basis: "Each submission from the fourth" } : { amount: 300, basis: "Each submission from the fourth" }; } }
      ],
      notesHtml: '<h3>What this estimate leaves out</h3><ul><li>No base fee was found for street plans or railway protection submissions.</li><li>The street works deposit for a new street, which is set by LTA\'s order.</li><li>The traffic consultant, monitoring instruments at the railway, and road reinstatement.</li></ul>'
    },
    facts: [
      { id: "name", label: "Project name or address", type: "text" },
      { id: "type", label: "Use", type: "select", options: [["res", "Flats or condominium"], ["office", "Office"], ["shop", "Shops"], ["fact", "Multi-user factory"], ["other", "Other"]], def: "res" },
      { id: "zone", label: "Parking zone", type: "select", options: [["1", "Zone 1: city and Marina Bay"], ["2", "Zone 2: within 400 m of a station"], ["3", "Zone 3: rest of the island"]], def: "3" },
      { id: "units", label: "Dwelling units", type: "number" },
      { id: "gfa", label: "GFA (m²)", type: "number" },
      { id: "lots", label: "Car lots proposed", type: "number" },
      { id: "rail", label: "Distance to the nearest railway structure (m)", type: "number" },
      { id: "road", label: "Distance to the nearest bridge, viaduct or road tunnel (m)", type: "number" },
      { id: "base", label: "Basement", type: "select", options: [["n", "No"], ["y", "Yes"]], def: "n" }
    ],
    pathway: function (p) {
      var out = [], z = (+p.zone || 3) - 1, r = Z[p.type], q = p.type === "res" ? p.units : p.gfa;
      if (r && q) { var lo = Math.round(q / r[z][0]), hi = Math.round(q / r[z][1]);
        if (p.lots) out.push(p.lots < lo ? { level: "bad", text: p.lots + " lots is below the lower bound of " + lo + ". LTA must review it, and the shortfall of " + (lo - p.lots) + " attracts a deficiency charge.", ref: "COP on Vehicle Parking Provision, Table 1" } : p.lots > hi ? { level: "warn", text: p.lots + " lots is above the upper bound of " + hi + " and needs justification.", ref: "COP on Vehicle Parking Provision, Table 1" } : { level: "info", text: p.lots + " lots is within the range of " + lo + " to " + hi + ".", ref: "COP on Vehicle Parking Provision, Table 1" });
        else out.push({ level: "info", text: "The range is " + lo + " to " + hi + " car lots.", ref: "COP on Vehicle Parking Provision, Table 1" }); }
      if (p.rail != null && p.rail !== "" && p.rail <= 40) out.push(p.rail > 20 && p.base !== "y" ? { level: "warn", text: "Inside the 40 m railway protection zone. With no basement and more than 20 m away, lodgement may apply if the site boundary is also more than 20 m from the structure.", ref: "COP for Railway Protection 1.2" } : { level: "bad", text: "Inside the 40 m railway protection zone. A development proposal, building proposal and permit are needed before engineering works, and the railway may move no more than 15 mm.", ref: "COP for Railway Protection 1.2, Table 2(b)" });
      if (p.road != null && p.road !== "" && p.road <= 20) out.push({ level: "bad", text: "Inside the 20 m road structure safety zone. A PE must get LTA's approval before any piling, excavation, anchors or crane work.", ref: "Road Structure Safety Zone Guide" });
      var t = { res: [p.units, 700, "700 homes"], office: [p.gfa, 20000, "20,000 m² of office"], shop: [p.gfa, 10000, "10,000 m² of retail"], fact: [p.gfa, 60000, "60,000 m² of industry"] }[p.type];
      if (t && t[0] >= t[1]) out.push({ level: "warn", text: "At or above " + t[2] + ": a transport impact assessment and a walking and cycling plan are needed before development control.", ref: "LTA TIA Guidelines, Annex A" });
      if (!out.length) out.push({ level: "info", text: "Enter the units or GFA to see the parking range, and the distances to any railway or road structure.", ref: "" });
      return out;
    },
    scopes: [{ id: "all", label: "All LTA rule sets" }, { id: "street", label: "Street works and access" }, { id: "park", label: "Vehicle parking" }, { id: "rail", label: "Railway protection" }, { id: "road", label: "Road structures and public streets" }],
    playbook: [
      { stage: "1. Site check", ask: ["Road categories and the road reserve line.", "Distance to any railway and any road structure."], check: ["Junctions, crossings and bus stops within 30 m of the planned access.", "Which parking zone the site is in."], chase: ["LTA's road line plan.", "The railway protection plan for the site."] },
      { stage: "2. Traffic and layout", ask: ["Does the size cross a TIA threshold?", "Number of lots by use."], check: ["One access, on the lowest category of road.", "Lot count between the lower and upper bounds, rounded by use."], chase: ["The traffic consultant, before the layout is fixed."] },
      { stage: "3. Parking design", ask: ["Parking angle and whether aisles are one-way or two-way."], check: ["Lots beside walls and columns widened.", "Ramp gradients with transitions, and 2.2 m headroom under the lowest fitting."], chase: ["The M&E services layout in the car park."] },
      { stage: "4. Frontage and access", ask: ["Footpath, cycling path and linkway widths along the frontage."], check: ["Driveway no steeper than 1 in 10 and queue space before the gate.", "Splay corners and sight lines at the boundary wall."], chase: ["The surveyor, for the land to be vested."] },
      { stage: "5. Railway and road structures", ask: ["Predicted movement, and the alert and work suspension levels."], check: ["No piles in the first reserve and no anchors in the first or second.", "Piling method: bored and debonded only in the second reserve."], chase: ["The PE (Geo) for any basement.", "The pre-condition survey."] },
      { stage: "6. Construction", ask: ["Latest monitoring readings."], check: ["Cranes and site offices against the 6 m line.", "Road opening permits and peak-hour restrictions."], chase: ["Instrument calibration every 6 months."] },
      { stage: "7. Handover", ask: ["Date of the CSC inspection."], check: ["Vesting completed.", "Nothing built on the road verge without approval."], chase: ["Return of the retained deposit after the maintenance period."] }
    ],
    entries: terms.concat(rules, process)
  };

  window.LTANUM = [
    ["40 m", "", "Railway protection zone, from any part of the railway", "", "COP for Railway Protection 1.2", "railway protection zone"],
    ["15 mm", "", "Most a railway structure may move because of nearby works", "", "COP for Railway Protection Table 2(b)", "allowable movement"],
    ["15 mm/s", "", "Vibration limit at a railway or a road structure", "", "COP for Railway Protection 3.1.4", "vibration"],
    ["20 m", "", "Road structure safety zone, from a bridge, viaduct or tunnel", "", "Road Structure Safety Zone Guide", "road structure safety zone"],
    ["30 m", "", "Least distance from an access to a junction, crossing or bus stop", "", "COP on Street Work Proposals Ch 4", "30 m"],
    ["1 in 10", "", "Steepest entrance driveway, and the preferred car park ramp", "", "COP on Street Work Proposals; COP on Vehicle Parking", "gradient"],
    ["2.4 x 4.8 m", "", "A car parking lot", "", "COP on Vehicle Parking 2.1.1", "lot size"],
    ["6.6 m", "", "Two-way aisle for 90-degree parking; 6.0 m one-way", "", "COP on Vehicle Parking 2.1.2", "aisle"],
    ["2.2 m", "", "Car park headroom under the lowest fitting", "", "COP on Vehicle Parking 2.1.5", "headroom"],
    ["1.3 kVA", "", "Electrical capacity for EV charging at every lot", "", "Electric Vehicles Charging Act, per LTA", "electric vehicle"],
    ["20", "", "Working days LTA gives itself for a complete submission", "", "LTA service standard", "service standard"],
    ["S$16,000", "", "Charge for each car lot short of the lower bound (2019)", "", "COP on Vehicle Parking Ch 1", "deficiency"]
  ];

  window.LTASTATS = {
    quotes: {
      hammurabi: { pic: "stamp", n: "40 m", nl: "from any part of a railway, inside which works need LTA's permission", lead: "Permission before the first borehole", text: "No engineering work shall commence on site without the permission of the Authority in writing.", paraphrase: true, by: "Code of Practice for Railway Protection, 2024 Edition, clause 4.2.2", src: S.rp },
      fire: { pic: "viaduct", n: "15 mm", nl: "the most a tunnel or viaduct may move because of the works next door", lead: "A railway is allowed to move the width of a finger", text: "Differential movement is limited to 15 mm or 1 in 1,000, whichever is the lesser.", paraphrase: true, by: "Code of Practice for Railway Protection, Table 2(b)", src: S.rp },
      thai: { pic: "collapse", n: "7", nl: "parties charged over the Tanjong Katong sinkhole, two of them qualified persons", lead: "The road is somebody's signature too", text: "Charges have been brought against seven parties.", paraphrase: true, by: "Joint news release by LTA, BCA and MOM, 11 June 2026", src: S.sink },
      bca: { pic: "check", n: "30 m", nl: "least distance from an access to a junction, crossing or bus stop", lead: "One way in", text: "Each development shall be served by only one access point.", paraphrase: true, by: "Code of Practice on Street Work Proposals, Version 2.0", src: S.rt }
    },
    tilesTitle: "LTA in numbers", tilesSub: "The network a site connects to, and what the submission turns on.",
    tiles: [
      { n: "9,500", label: "lane-kilometres of roads and expressways", year: "current", by: "LTA", src: S.road },
      { n: "40 m", label: "railway protection zone on every side of a line", year: "current", by: "LTA", src: S.rp },
      { n: "20", label: "working days for a complete submission", year: "current", by: "LTA", src: S.fees },
      { n: "3", label: "submissions free of charge before resubmission fees start", year: "since June 2023", by: "LTA", src: S.fees },
      { n: "25", label: "reports of unauthorised works on the road verge outside private homes, in three years", year: "March 2026", by: "Ministry of Transport", src: S.verge },
      { n: "700", label: "homes at which a transport impact assessment is needed", year: "2019 guidelines", by: "LTA", src: S.tia }
    ],
    seriesTitle: "", seriesSub: "", series: [],
    timeline: [
      { year: "2004", bad: true, event: "Nicoll Highway collapses during Circle Line excavation", law: "Three of the contractor's engineers and an LTA officer are later fined. Monitoring readings had been warning for weeks.", by: "Committee of Inquiry, as summarised", src: S.nicoll },
      { year: "2011", event: "Road structure safety zone", law: "LTA's guide sets out the 20 m zone around bridges, viaducts and road tunnels.", by: "LTA", src: S.rssz },
      { year: "2019", event: "Range-based parking and a new street works code", law: "From February the number of lots must fall within a range by use and zone. Version 2.0 of the street works code follows in April.", by: "LTA", src: S.vp },
      { year: "2021", event: "Railway protection rules revised", law: "A lodgement route opens for low-risk works, and cranes within 6 m of a railway move from a ban to special approval.", by: "LTA briefing", src: S.dbw },
      { year: "2023", event: "Resubmission fees", law: "From 1 June the fourth and later submissions are charged at S$300 or S$1,200.", by: "LTA", src: S.fees },
      { year: "2024", event: "Code of Practice for Railway Protection, 2024 Edition", law: "It replaces the 2005 handbook on works in the railway protection zone.", by: "LTA", src: S.rp },
      { year: "2025", bad: true, event: "Sinkhole at Tanjong Katong Road South", law: "The road collapses beside a shaft on 26 July.", by: "LTA, BCA and MOM", src: S.sink },
      { year: "2026", bad: true, event: "Seven parties charged over the sinkhole", law: "They include the builder, its managers, two qualified persons and a resident engineer. These are charges, not findings.", by: "Joint news release, 11 June 2026", src: S.sink },
      { year: "2026", event: "Tighter rules for tunnels in soft ground", law: "An addendum requires consolidation analysis and closer monitoring, after tunnel movements were seen near several building sites.", by: "LTA circular, September 2026", src: S.rpadd }
    ],
    disasters: null, db: null, systems: null
  };

  window.LTACASES = [
    { stage: "Construction", tag: "2025 · Tanjong Katong sinkhole", img: "img/case5.jpg", title: "A sinkhole in a public road, and seven parties charged", when: "26 July 2025; charges announced 11 June 2026", where: "Tanjong Katong Road South",
      story: [["collapse", "The road collapses into a sinkhole beside a construction shaft."], ["falsedoc", "The authorities allege road resurfacing that did not comply, specialist work by an unlicensed party, mandatory tests not done, a road depression not reported, and a false declaration."], ["gavel", "Seven parties are charged: the builder, three of its managers, two qualified persons and a resident engineer."]],
      big: [["7", "parties charged"], ["2", "qualified persons among them"], ["0", "outcomes so far"]],
      lesson: "Works under a public road put the qualified person and the site supervisor personally in front of three authorities at once. These are allegations that have not been tested in court.", grade: "charges only; no outcome yet", src: [["Joint news release by LTA, BCA and MOM, 11 June 2026", S.sink]] },
    { stage: "Monitoring", tag: "2004 · Nicoll Highway", img: "img/case4.jpg", title: "The instruments were warning and the work went on", when: "20 April 2004", where: "Circle Line excavation, Nicoll Highway",
      story: [["deepex", "A deep excavation for the Circle Line runs beside Nicoll Highway."], ["mismatch", "Monitoring readings pass their trigger levels. The levels are revised and the excavation continues."], ["collapse", "The retaining system fails and the highway collapses. Four workers die."]],
      big: [["S$200,000", "fine on each of two of the contractor's engineers"], ["S$120,000", "fine on the project director"], ["S$8,000", "fine on the LTA officer responsible for monitoring"]],
      lesson: "An alert level and a work suspension level only protect anyone if the work actually stops. This is why LTA now asks for both, in writing, before a permit.", grade: "fines as summarised in a secondary source", src: [["Nicoll Highway collapse, summary of the inquiry and prosecutions", S.nicoll]] },
    { stage: "Handover", tag: "2026 · The road verge", img: "img/case6.jpg", title: "The verge outside the gate is not the owner's", when: "2023 to 2026", where: "Private landed housing estates",
      story: [["extra", "Owners pave, plant or build on the strip of State land between their boundary and the road."], ["nostamp", "The strip is road reserve managed by LTA, and nothing was approved."], ["clock", "About 25 cases are reported in three years. Four have been put right and the rest are pending."]],
      big: [["25", "reports in three years"], ["4", "rectified"], ["0", "payment when land is vested for the road"]],
      lesson: "Show the road reserve line on every drawing and keep the client's works behind it. What is built beyond it has to come out at the owner's cost.", src: [["Ministry of Transport written reply, 6 March 2026", S.verge]] }
  ];

  var BY = "Compiled from LTA's codes of practice and guides. LTA does not publish a list of common reasons for rejection.";
  window.LTAMIST = [
    { id: "access", name: "Access", by: BY, src: S.rt, items: [
      ["Access on the main road", "It belongs on the lowest category of road fronting the site.", "mismatch"],
      ["Too close to a junction or bus stop", "At least 30 m from junctions, bends, crossings, bus stops and the access opposite.", "draft"],
      ["Two accesses for convenience", "One per development unless there is a technical reason.", "extra"],
      ["Gate at the boundary", "Vehicles need queue space inside the site, at least two cars for a residential development.", "clock"],
      ["Driveway too steep", "Not steeper than 1 in 10.", "check"]] },
    { id: "park", name: "Parking", by: BY, src: S.vp, items: [
      ["Lots outside the range", "Below the lower bound means a review and a charge. Above the upper bound needs justification.", "mismatch"],
      ["Rounding the total", "Each use is rounded first, then added.", "draft"],
      ["A column in the bay", "A lot beside an obstruction widens to 2.7 m, or 3.0 m with one on each side.", "extra"],
      ["Two-way aisle drawn at 6.0 m", "For 90-degree parking it is 6.6 m. 6.0 m is one-way.", "mismatch"],
      ["Headroom to the slab", "The 2.2 m is measured to the underside of beams, signs and sprinklers.", "check"],
      ["Ramp with no transition", "1 in 10 preferred, 1 in 8.3 at most, with transitions at the floors.", "draft"]] },
    { id: "rail", name: "Railway", by: BY, src: S.rp, items: [
      ["Finding the zone late", "The 40 m line should be on the first site plan.", "clock"],
      ["Piles in the first reserve", "Not allowed. In the second reserve only bored, debonded piles 6 m clear.", "deepex"],
      ["Ground anchors towards the railway", "Not allowed in the first or second reserve.", "nostamp"],
      ["No work suspension level", "The QP must propose both an alert level and a level at which work stops.", "check"],
      ["Crane inside 6 m", "Needs LTA's special approval.", "crane"]] },
    { id: "road", name: "Roads", by: BY, src: S.wps, items: [
      ["Opening a newly surfaced road", "No opening for 1 year after resurfacing, or 2 years after a new road.", "nostamp"],
      ["Lane closed in the peak", "Not allowed in the morning and evening peaks.", "clock"],
      ["Patch narrower than the lane", "Reinstatement is full lane width and at least 50 mm thick.", "mismatch"],
      ["Works near a viaduct with no approval", "Within 20 m of a road structure a PE must apply first.", "viaduct"]] },
    { id: "sub", name: "Submission", by: BY, src: S.fees, items: [
      ["Burning the three free submissions", "The fourth costs S$300 or S$1,200 each time.", "money"],
      ["Development proposal lapsed", "It is valid for 24 months, and the building proposal follows within 12.", "clock"],
      ["A false lodgement", "A wrong self-declaration revokes the acknowledgement.", "falsedoc"],
      ["TIA started late", "It is prepared before development control, not after.", "clock"]] },
    { id: "done", name: "Handover", by: BY, src: S.rt, items: [
      ["Land not vested", "Vesting comes before CSC, with the subdivision and certified plans.", "nostamp"],
      ["Building on the verge", "The strip beyond the road reserve line is State land.", "extra"],
      ["Forgetting the maintenance period", "One year for a new street, bridge or underpass, with part of the deposit held.", "money"]] }
  ];

  window.LTAQUIZ = [
    ["Railway", "How wide is the railway protection zone?", "40 m from any part of the railway", ["6 m", "20 m", "60 m"], "Above, on or below the ground.", "COP for Railway Protection 1.2"],
    ["Railway", "What is the most a railway structure may move in total?", "15 mm", ["5 mm", "25 mm", "50 mm"], "Differential movement: 15 mm or 1 in 1,000, whichever is less.", "COP for Railway Protection Table 2(b)"],
    ["Railway", "What is the vibration limit at a railway?", "15 mm/s", ["5 mm/s", "25 mm/s", "50 mm/s"], "The same figure applies at road structures and sewers.", "COP for Railway Protection 3.1.4"],
    ["Railway", "Are ground anchors allowed in the second reserve of an underground railway?", "No", ["Yes, if debonded", "Yes, above the tunnel crown", "Yes, with monitoring"], "Nor in the first reserve.", "COP for Railway Protection Table 4"],
    ["Railway", "How long is a railway development proposal valid?", "24 months", ["6 months", "12 months", "5 years"], "The building proposal follows within 12 months.", "LTA briefing on the 2021 Regulations"],
    ["Roads", "How wide is the road structure safety zone?", "20 m", ["6 m", "40 m", "100 m"], "From a bridge, viaduct, road tunnel, underpass or retaining wall.", "Road Structure Safety Zone Guide"],
    ["Roads", "For how long may a newly resurfaced road not be opened?", "1 year", ["3 months", "6 months", "5 years"], "2 years for a new or upgraded road.", "COP for Works on Public Streets"],
    ["Access", "How far must an access be from a junction or bus stop?", "At least 30 m", ["10 m", "15 m", "50 m"], "", "COP on Street Work Proposals Ch 4"],
    ["Access", "How many accesses does a development normally get?", "One", ["Two", "One per frontage", "One per 100 lots"], "A second may be considered above 600 homes.", "COP on Street Work Proposals Ch 4"],
    ["Access", "What is the steepest entrance driveway?", "1 in 10", ["1 in 5", "1 in 8.3", "1 in 20"], "", "COP on Street Work Proposals Ch 4"],
    ["Access", "How wide is a standard footpath along the frontage?", "1.8 m", ["1.2 m", "1.5 m", "2.4 m"], "A covered linkway is 2.4 m.", "COP on Street Work Proposals Table 2.4"],
    ["Parking", "What size is a car parking lot?", "2.4 m by 4.8 m", ["2.2 m by 4.5 m", "2.5 m by 5.0 m", "3.0 m by 5.4 m"], "A parallel lot is 5.4 m long.", "COP on Vehicle Parking 2.1.1"],
    ["Parking", "What is the two-way aisle for 90-degree parking?", "6.6 m", ["5.4 m", "6.0 m", "7.2 m"], "6.0 m is the one-way aisle.", "COP on Vehicle Parking 2.1.2"],
    ["Parking", "What is the steepest car park ramp?", "1 in 8.3", ["1 in 5", "1 in 10", "1 in 12"], "1 in 10 is preferred.", "COP on Vehicle Parking 2.1.4"],
    ["Parking", "What is the minimum car park headroom?", "2.2 m", ["2.0 m", "2.4 m", "2.7 m"], "To the underside of the lowest fitting.", "COP on Vehicle Parking 2.1.5"],
    ["Parking", "What defines parking Zone 2?", "Within 400 m of an MRT or LRT station", ["The city centre", "Any HDB town", "Within 1 km of an expressway"], "Zone 1 is the city and Marina Bay.", "COP on Vehicle Parking Ch 1"],
    ["Parking", "How much electrical capacity must each lot have for EV charging?", "1.3 kVA", ["0.5 kVA", "3.7 kVA", "7.4 kVA"], "With chargers for at least 20% of that load.", "Electric Vehicles Charging Act, per LTA"],
    ["Process", "From which submission does LTA charge a resubmission fee?", "The fourth", ["The second", "The third", "Never"], "S$300 or S$1,200 each.", "LTA service standard and fees schedule"]
  ];
})();
