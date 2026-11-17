/* URA planning permission data set. Same shape as data.js and st-data.js so the one engine renders it.
   Researched 17 Nov 2026 from URA handbooks, circulars, the fee schedule, SLA and court judgments.
   status "unverified" marks anything read only from a statute mirror, a secondary source, or a table that could not be read cleanly. */
(function () {
  "use strict";
  var U = "https://www.ura.gov.sg/", HB = U + "guidelines/development-control/development-control-handbooks/", PP = U + "guidelines/development-control/planning-permission/";
  var ACT = "https://sso.agc.gov.sg/Act/PA1998", FEE = "https://isomer-user-content.by.gov.sg/467/2ff3ae21-fb91-4ba0-8f38-c6fa5f966e29/development-control-fee-schedule.pdf";
  var S = {
    exempt: PP + "dasub/exemption/", lodge: PP + "plan-lodgment-application/", extend: PP + "extend-planning-permission/", outline: PP + "outline-application/", main: PP,
    qp: U + "Corporate/Guidelines/Circulars/dc17-05", lbc: U + "guidelines/circulars/dc22-08/", sla: "https://www.sla.gov.sg/properties/land-betterment-charge/", cx: U + "guidelines/circulars/dc23-07/", cx26: U + "guidelines/circulars/dc26-08/",
    gfa: U + "Corporate/Guidelines/Development-Control/gross-floor-area/GFA", gfam: HB + "gross-floor-area/gfa-related-matters/", harm: U + "guidelines/circulars/dc22-09/", bonus: HB + "residential/flats-condominiums/bonus-gfa/",
    landed: U + "guidelines/best-practices/clarifications-landed-housing-guidelines/", bung: HB + "residential/bungalows/setbacks-from-boundaries/", prevail: U + "Corporate/Property/Residential/Renovating-private-residential-property/Land-titled-residential/Landed-Residential-Works/Prevailing-Planning-Controls",
    semi: U + "Corporate/Guidelines/Development-Control/Residential/Semi-Detached-Houses/Redeveloping", fh: HB + "residential/flats-condominiums/building-height/", fset: U + "Corporate/Guidelines/Development-Control/Residential/Flats-Condominiums/Setback",
    fcov: HB + "residential/flats-condominiums/site-coverage/", du: HB + "residential/flats-condominiums/maximum-number-du/", b1: HB + "non-residential/b1/use-quantum/", b2: HB + "non-residential/b2/setback/", b2s: U + "Corporate/Guidelines/Development-Control/Non-Residential/B2/Summary",
    cons: U + "guidelines/conservation/historic-districts/", check: PP + "dasub/submission-checklist/", bor: "https://www.elitigation.sg/gd/s/2009_SGHC_154", pl: "https://www.elitigation.sg/gd/s/2015_SGHC_251",
    dorm: U + "news/media/pr24-29/", desker: U + "news/media/pr26-30/", sta: U + "news/media/pr25-47/"
  };
  function up(a) { return Math.ceil(Math.max(0, a) / 100); }

  var rules = [
    /* GFA and intensity */
    ["gfa-gpr", "gfa", "Intensity", "verified", "Proposed GFA within the Master Plan plot ratio", "Gross plot ratio is GFA divided by site area, so the allowable GFA is the Master Plan GPR times the site area. The Master Plan GPR is an upper bound and may not be achievable on a given plot because of its shape, setbacks or height limits.", "GFA table or schedule of areas; site area on the site plan; stated GPR.", "URA GFA Handbook, Introduction", S.gfa],
    ["gfa-bonus", "gfa", "Intensity", "verified", "Bonus GFA is capped at 10% of the Master Plan GPR", "GFA above the Master Plan GPR is allowed only under bonus schemes, and all schemes together may not exceed 10% of the Master Plan GPR. Bonus GFA does not carry over when the site is redeveloped.", "Any GFA marked as bonus, with the scheme named and its percentage.", "URA Handbook, Bonus GFA", S.bonus],
    ["gfa-wall", "gfa", "Measurement", "verified", "GFA is measured to the middle of the external wall", "From 1 June 2023 URA, SLA, BCA and SCDF all measure floor area to the middle of the external wall, excluding finishes. All strata area counts as GFA and voids are excluded.", "GFA boundary lines drawn at the wall centre line on each floor plan.", "URA circular DC22-09; GFA Handbook", S.harm],
    ["gfa-strata", "gfa", "Measurement", "verified", "GFA and strata boundaries on every floor plan", "Strata developments show both the GFA boundary and the strata boundary on each floor plan. URA says missing strata boundaries may delay approval.", "Two distinct boundary lines per floor plan, with a legend.", "URA GFA Handbook, GFA related matters", S.gfam],
    ["gfa-balcony", "gfa", "Inclusions", "unverified", "Balconies count as GFA unless under the incentive scheme", "Balconies are GFA unless given as bonus under the Balcony Incentive Scheme. A 2018 circular cut the bonus for private outdoor spaces from 10% to 7%, set a minimum balcony width of 1.5 m and capped balcony area at 15% of the unit's nett internal area. Whether those figures are still current was not confirmed.", "Balcony widths, balcony area against unit area, and the bonus GFA percentage.", "URA Handbook, Balconies; circular DC18-07", HB + "gross-floor-area/balconies/"],
    ["gfa-bay", "gfa", "Inclusions", "verified", "Bay windows count as GFA", "Bay windows are included as GFA, except those approved before 1 January 2009.", "Bay windows on plan, and whether they are inside the GFA line.", "URA Handbook, Bay windows", HB + "gross-floor-area/bay-windows/"],
    ["gfa-ledge", "gfa", "Inclusions", "verified", "Air-conditioner ledges", "An AC ledge that is part of a strata lot counts as GFA. For a non-strata ledge the first 2.0 m of width, measured out from the external wall, is excluded.", "Ledge depth dimension and whether it sits inside the strata boundary.", "URA Handbook, Ledges", HB + "gross-floor-area/ledges/"],
    ["gfa-me", "gfa", "Exclusions", "verified", "M&E floors with headroom up to 1.8 m are excluded", "M&E floors with headroom of up to 1.8 m are excluded from GFA. M&E rooms in a fully sunken common basement car park are also excluded.", "Section showing the M&E floor headroom.", "URA Handbook, M&E spaces", HB + "gross-floor-area/mechanical-and-electrical-me-spaces/"],
    ["gfa-carpark", "gfa", "Exclusions", "verified", "Car parking on common car park floors is excluded", "Vehicle parking areas and driveways on common car park floors are excluded from GFA. For some uses and locations, lots above the upper bound of the range-based parking standard count as GFA.", "Car park floor plans with lot count against the parking standard.", "URA Handbook, Car parks", HB + "gross-floor-area/car-parks-motorcycle-parks-and-related-facilities/"],
    ["gfa-walk", "gfa", "Exclusions", "verified", "Covered public walkway widths", "A covered walkway open to the public at all times is excluded from GFA. Minimum overall and clear widths are 3.6 m and 3.0 m within 200 m of an MRT station or in the Central Area, 3.0 m and 2.4 m from 200 to 400 m, and 2.4 m and 2.0 m elsewhere.", "Walkway width dimensions on the first storey plan.", "URA Handbook, Covered walkways and linkages", HB + "gross-floor-area/covered-walkway-and-linkages/"],
    ["gfa-sky", "gfa", "Exclusions", "verified", "Sky terrace conditions", "A sky terrace is exempt only if at least 40% of its perimeter is open, it is at least 5.0 m deep, and parapet walls are no higher than 1.3 m.", "Sky terrace plan with open perimeter, depth and parapet height.", "URA Handbook, Sky terraces", HB + "gross-floor-area/sky-terraces/"],
    /* Landed housing */
    ["l-height", "landed", "Envelope", "verified", "Landed house envelope height", "The building envelope is 12 m high in a 2-storey landed housing area and 15.5 m in a 3-storey area, measured from the external platform level or PUB's minimum platform level, whichever is higher. Lift overruns and safety barriers on flat roofs may exceed it by up to 1 m.", "Section with overall height from platform level; the landed housing area type.", "URA, Clarifications on landed housing guidelines", S.landed],
    ["l-roofterr", "landed", "Envelope", "verified", "Roof terrace at least 3 m below the top of the envelope", "An accessible roof terrace must sit at least 3 m below the top of the permissible building envelope. An attic is allowed inside the envelope.", "Section showing the roof terrace level against the envelope line.", "URA Handbook, envelope control", S.landed],
    ["l-road", "landed", "Setbacks", "verified", "Landed house road buffer by road category", "Road buffer measured from the road reserve line: 24 m on a Category 1 road and 12 m on Category 2, each including a 5 m green buffer; 7.5 m on Categories 3 and 4 including a 3 m green buffer; 7.5 m on Category 5 with no green buffer.", "Road reserve line, road category, and the dimension from it to the building line.", "URA Handbook, Bungalows, setbacks from boundaries", S.bung],
    ["l-side", "landed", "Setbacks", "verified", "Landed house side and rear setbacks", "Side and rear setbacks are 2 m to the main building, with eaves allowed to within 1 m. In a Good Class Bungalow Area, or on a plot abutting one, they are 3 m and 1.6 m.", "Dimensions from each common boundary to the wall and to the eaves.", "URA Handbook, Bungalows, setbacks from boundaries", S.bung],
    ["l-porch", "landed", "Setbacks", "verified", "Car porch within the road buffer", "On Category 3 to 5 roads a car porch may extend 2.4 m into the road buffer, for the first 3 m of width measured column to column. Wider porches are considered on merit.", "Car porch depth into the buffer and its width.", "URA Handbook, Bungalows, setbacks from boundaries", S.bung],
    ["l-plot", "landed", "Plot", "verified", "Minimum plot size and width by house type", "Detached house: 400 m² and 10 m wide. Semi-detached and corner terrace I: 200 m² and 8 m. Intermediate terrace I: 150 m² and 6 m. Terrace II: 80 m², 6 m wide intermediate or 8 m at a corner.", "Plot area and frontage width on the site plan.", "URA, Prevailing planning controls for landed housing", S.prevail],
    ["l-gcba", "landed", "Plot", "verified", "Good Class Bungalow plot", "A plot in a Good Class Bungalow Area needs at least 1,400 m², 18.5 m width and 30 m depth, with 3 m side and rear setbacks.", "Plot area, width and depth.", "URA, Prevailing planning controls for landed housing", S.prevail],
    ["l-cov", "landed", "Plot", "unverified", "Site coverage for detached houses", "URA's table gives a detached house 40% site coverage with 50% overall, and a Good Class Bungalow 35% with 45% overall. There is no site coverage control for semi-detached and terrace houses. How URA applies the two figures was not confirmed.", "Building footprint area against nett plot area.", "URA, Prevailing planning controls for landed housing", S.prevail],
    ["l-nett", "landed", "Plot", "verified", "Plot size is assessed on the nett area", "Plot size and site coverage are assessed on the nett area after any land is vested for road widening or drainage reserve.", "Road reserve and drainage reserve lines; gross and nett site areas.", "URA, Clarifications on landed housing guidelines", S.landed],
    ["l-semi", "landed", "Redevelopment", "verified", "Redeveloping one half of a semi-detached pair", "Breaking away to a detached house is not allowed if the plot left behind is too small for a standard detached house. A new blank party wall at the common boundary is generally not allowed, and the exposed wall of the remaining house must be made good.", "The adjoining plot's area and what is proposed at the common boundary.", "URA Handbook, Semi-detached houses, redeveloping", S.semi],
    ["l-base", "landed", "Envelope", "verified", "Landed house basement", "A basement that protrudes above ground counts within the envelope. A fully submerged basement may extend under the green buffer or the 2 m planting verge only if that part is at least 2 m below ground, and it may not open to the neighbour.", "Section through the basement at the boundary.", "URA Handbook, envelope control", S.landed],
    /* Flats and condominiums */
    ["f-storey", "flats", "Height", "verified", "Storeys guided by plot ratio", "For residential-only sites the number of storeys follows the GPR: 1.4 gives 5 storeys, 1.6 gives 12, 2.1 gives 24, 2.8 gives 36, and above 2.8 more than 36. Around the Botanic Gardens the figures are 4, 10, 20 and 30. Street block plans, technical height controls and conservation can override.", "Storey count in the section against the site GPR.", "URA Handbook, Flats and condominiums, building height", S.fh],
    ["f-ftf", "flats", "Height", "verified", "Floor-to-floor heights", "Floor-to-floor height is 5.0 m for the first storey and 3.6 m for other storeys. At GPR 1.6 and above the top storey may also be 5.0 m.", "Floor-to-floor dimensions in the section.", "URA Handbook, Flats and condominiums, building height", S.fh],
    ["f-base", "flats", "Height", "verified", "A protruding basement counts as a storey", "A basement that protrudes more than 1.0 m above ground level on any side is counted as a storey.", "Basement level against ground level on every elevation.", "URA Handbook, Flats and condominiums, building height", S.fh],
    ["f-road", "flats", "Setbacks", "verified", "Flats and condominium road buffer", "Residential buildings of 6 storeys and above: 30 m on Category 1, 15 m on Category 2, 10 m on Category 3 and 7.5 m on Categories 4 and 5. Up to 5 storeys: 24 m, 12 m, 7.5 m and 7.5 m. The green buffer is 5 m on Categories 1 and 2 and 3 m on the rest.", "Road reserve line, road category and the dimension to the external wall.", "URA Handbook, Flats and condominiums, setback", S.fset],
    ["f-common", "flats", "Setbacks", "unverified", "Setback from common boundaries", "A planting verge at least 2 m wide runs along every common boundary. The building setback starts at 3.0 m for one storey and rises with height, to 12.6 m for flats and 15.5 m for condominiums at 36 storeys and above. The intermediate figures were not read cleanly, so check URA's table.", "Planting verge width and the setback to the wall at each height.", "URA Handbook, Flats and condominiums, setback", S.fset],
    ["f-cov", "flats", "Site", "verified", "Site coverage of flats and condominiums", "Maximum site coverage is 50% of the nett site area, after vested roads, road widening and drainage reserves. Structures more than 1 m above ground count.", "Footprint area against nett site area.", "URA Handbook, Flats and condominiums, site coverage", S.fcov],
    ["f-du", "flats", "Units", "verified", "Maximum number of dwelling units", "Outside the Central Area the number of dwelling units is capped at the Master Plan GPR times the site area, divided by 85 m². In the estates URA lists the divisor is 100 m². It is an upper bound only.", "Unit count in the schedule against the cap.", "URA Handbook, Flats and condominiums, maximum number of dwelling units", S.du],
    ["f-mix", "flats", "Units", "unverified", "Unit size mix", "In the Central Area there is no unit cap but at least 20% of units must have a nett internal area of 70 m² or more. Every unit island-wide must be at least 35 m². The mix rule URA applies outside the Central Area was not read cleanly.", "Unit schedule with nett internal areas.", "URA Handbook, Flats and condominiums, maximum number of dwelling units", S.du],
    /* Industrial and commercial */
    ["n-6040", "nonres", "Use", "verified", "The 60/40 rule for industrial buildings", "At least 60% of the GFA of a Business 1 or Business 2 development must be for industrial use. Up to 40% may be ancillary uses. In a multi-user building the 40% applies to the whole development and within each strata unit.", "Use schedule by floor with GFA for each use.", "URA Handbook, Business 1, use quantum", S.b1],
    ["n-road", "nonres", "Setbacks", "verified", "Industrial road buffer", "For Business 2 the road buffer is 15 m on Category 1 including a 5 m green buffer, 7.5 m on Category 2, and 5 m on Categories 3 to 5, each including a 3 m green buffer.", "Road reserve line, road category and dimension to the building.", "URA Handbook, Business 2, setback", S.b2],
    ["n-common", "nonres", "Setbacks", "verified", "Industrial setback from common boundaries", "Next to a non-industrial neighbour the setback is at least 4.5 m plus a 2 m planting verge. Next to an industrial neighbour no setback is needed, but there may be no openings on the boundary wall.", "Neighbouring use, setback dimension and any openings on the boundary.", "URA Handbook, Business 2, setback", S.b2],
    ["n-buffer", "nonres", "Use", "verified", "Nuisance buffer around industrial zones", "NEA requires a 50 m nuisance buffer around a Business 1 zone and 100 m around a Business 2 zone.", "Distance from the zone boundary to the nearest sensitive use.", "URA Handbook, Business 2, summary", S.b2s],
    ["n-dorm", "nonres", "Use", "unverified", "Workers' dormitory in an industrial building", "A 2023 circular let temporary workers' dormitories in industrial and warehouse developments take up to 49% of GFA instead of 40%, subject to review. Whether 49% still applies was not confirmed.", "Dormitory GFA as a share of total GFA.", "URA circular DC23-03", U + "Corporate/Guidelines/Circulars/dc23-03"],
    /* Conservation */
    ["c-3r", "cons", "Principle", "verified", "The 3R principle", "Works to a conserved building follow maximum retention, sensitive restoration and careful repair. Replacement is accepted only where necessary and with URA's clearance.", "Demolition and retention plans showing what stays.", "URA Conservation Guidelines", S.cons],
    ["c-roof", "cons", "Elements", "verified", "Roof, facade and party wall are retained", "The original roof profile, pitch, height and eaves are kept, as are the front facade features, the five-foot way and, in most cases, the first 3 m of the party wall behind the shopfront. Airwells keep their original size and position.", "Existing and proposed sections and elevations.", "URA Conservation Guidelines", S.cons],
    ["c-flat", "cons", "Limits", "verified", "Structures on a conserved building's flat roof", "Structures on a flat roof may cover at most 35% of the flat roof, be at most 3.6 m high, and sit 3 m back from the front and side street elevations.", "Roof plan with structure area and setbacks; height in section.", "URA Conservation Guidelines", S.cons],
    ["c-void", "cons", "Limits", "verified", "Voids, skylights and basements in a conserved building", "Floor voids may take at most 25% of each unit's floor area and skylights at most 30% of a roof slope. New basements are not allowed.", "Void areas per floor; skylight area on the roof plan.", "URA Conservation Guidelines", S.cons],
    /* Submission and permission */
    ["s-owner", "sub", "Documents", "verified", "Owner's written consent", "An applicant who does not own the land must first get the owner's written consent, or SLA's for State land.", "Owner's consent letter in the submission.", "URA, Outline application", S.outline],
    ["s-title", "sub", "Documents", "verified", "Submission checklist and deviations", "URA's development control checklist guides the QP on what each plan must show. Any item that does not comply goes in a deviation annex with the reason.", "Title block, north point, scale, site boundary, road reserve lines and a deviation list where relevant.", "URA, Submission checklist", S.check]
  ].map(function (r) { return { id: "ura-r-" + r[0], kind: "rule", scope: r[1], agency: "URA", topic: r[2], status: r[3], title: r[4], body: r[5], evidence: r[6], ref: r[7], src: r[8] }; });

  var process = [
    ["s-need", "Planning permission is needed for development", "A person must not carry out development without planning permission. Development covers building, engineering and earthworks, and any material change in the use of land or a building.", "Planning Act 1998 ss 3, 12", ACT, "unverified"],
    ["s-penalty", "Penalty for unauthorised development", "The fine is up to S$200,000, with up to S$10,000 a day for a continuing offence after conviction. A repeat offender can also be jailed for up to 12 months. Demolishing a conserved building carries up to S$500,000, 12 months' jail, or both.", "Planning Act 1998 s 12", S.desker, "unverified"],
    ["s-valid", "How long permission lasts", "A provisional permission lapses 6 months from the day it is granted. A written permission lapses after 2 years.", "URA, Extend planning permission", S.extend, "verified"],
    ["s-ext", "Extending a written permission", "Apply at least 2 months before expiry. Up to two extensions are given if construction has not started and no public scheme affects the site. Once foundation or piling has started, further extensions depend on sufficient progress.", "URA, Extend planning permission", S.extend, "verified"],
    ["s-appeal", "Appeal to the Minister", "An applicant aggrieved by URA's decision may appeal to the Minister for National Development within 60 days of being notified. The Minister's decision is final.", "Planning Act 1998 s 22", S.bor, "unverified"],
    ["s-qp", "A qualified person must be appointed", "The developer appoints a qualified person to prepare the plans, submit the application and supervise the works. Minor works to a landed house or single unit, change of use and renewal of permission are exempt.", "Planning (Qualified Persons) Rules 2017; URA circular DC17-05", S.qp, "verified"],
    ["s-tol", "The QP's declaration before TOP", "Before TOP the supervising QP declares that the building was built to the written permission plans. The declaration covers nine parameters, including footprint, setbacks, height and storeys, with a 3% construction tolerance.", "URA circular DC17-05", S.qp, "verified"],
    ["s-lbc", "Land Betterment Charge", "From 1 August 2022 the Land Betterment Charge replaced the development charge, temporary development levy and differential premium. SLA issues a liability order after the planning application is made, and payment is due within 1 month.", "Land Betterment Charge Act 2021; URA circular DC22-08", S.lbc, "verified"],
    ["s-cx", "CORENET X is mandatory for larger projects", "New projects of 5,000 m² GFA and above must be submitted through CORENET X from 1 October 2026. Below that it is voluntary. The agencies review jointly and give one consolidated response at each gateway.", "URA circulars DC23-07 and DC26-08", S.cx26, "unverified"],
    ["s-resub", "Resubmission and retention fees", "A resubmission is charged 50% of the new application fee from the second resubmission, or the third under CORENET X. Keeping an unauthorised structure or use adds S$2,500 and a civil penalty.", "URA Development Control Fee Schedule, Table 5", FEE, "verified"]
  ].map(function (r) { return { id: "ura-" + r[0], kind: "rule", scope: "sub", agency: "URA", topic: "Process", status: r[5], checkable: false, title: r[1], body: r[2], ref: r[3], src: r[4] }; });

  var terms = [
    ["gpr", "Gross plot ratio (GPR)", "GFA divided by site area. The Master Plan sets the maximum for each plot.", "URA GFA Handbook", S.gfa],
    ["gfa", "Gross floor area (GFA)", "The total covered floor area, measured to the middle of the external wall, including all strata area and excluding voids.", "URA GFA Handbook", S.gfa],
    ["pp", "Provisional permission (PP)", "URA's first-stage approval, given while details may still change. It lapses after 6 months.", "URA, Extend planning permission", S.extend],
    ["wp", "Written permission (WP)", "URA's formal grant of planning permission. It lapses after 2 years unless extended.", "URA, Extend planning permission", S.extend],
    ["lodge", "Plan lodgment", "For works that fully meet the guidelines, a qualified person lodges the plans with a declaration and they are treated as authorised, without URA assessing them first. A lodgment is valid for 2 years.", "URA, Plan lodgment", S.lodge],
    ["lbc", "Land Betterment Charge (LBC)", "A tax on the rise in land value from a planning approval, charged by SLA from a table of rates by use group and sector, or by valuation.", "SLA", S.sla],
    ["buffer", "Road buffer", "The setback from the road reserve line, set by the road's category. It includes a green buffer for planting.", "URA Handbooks", S.bung],
    ["envelope", "Envelope control", "For landed houses URA controls an outer envelope instead of each storey height. Piloted in July 2019 and adopted in July 2021.", "URA, Clarifications on landed housing guidelines", S.landed],
    ["outline", "Outline application", "A test of a proposed use, plot ratio or height before detailed design. Needed where the proposal exceeds approved parameters or departs from the Master Plan. URA says assessment generally takes 20 working days.", "URA, Outline application", S.outline]
  ].map(function (t) { return { id: "ura-" + t[0], kind: "term", agency: "URA", status: "verified", title: t[1], body: t[2], ref: t[3], src: t[4] }; });

  var hurdles = [
    ["h-exempt", "Assuming an exemption applies in a conservation area", "URA's list of works that need no permission does not apply to national monuments, conserved buildings and conservation areas.", "URA, Works that do not need planning permission", S.exempt],
    ["h-lodge", "A wrong lodgment declaration", "A lodgment that turns out not to comply can be rejected, and the qualified person or firm can be barred from the scheme.", "URA, Plan lodgment", S.lodge]
  ].map(function (t) { return { id: "ura-" + t[0], kind: "hurdle", agency: "URA", status: "verified", title: t[1], body: t[2], ref: t[3], src: t[4] }; });

  function opt(id, label, qp, verdict, vlabel, basis, detail, ref, src, tags) { return { id: id, label: label, qp: qp, verdict: verdict, vlabel: vlabel, confidence: "High", basis: basis, detail: detail, ref: ref, src: src, tags: tags }; }
  var EX = "URA, Works that do not need planning permission";

  window.URADATA = {
    meta: { asOf: "17 Nov 2026", setName: "URA planning permission", note: "Internal reference for CVC Engineers. It summarises published rules and is not legal advice or an authority decision; the qualified person remains responsible for every submission." },
    synonyms: { gpr: ["gross plot ratio", "plot ratio"], wp: ["written permission"], pp: ["provisional permission"], lbc: ["land betterment charge"], dc: ["development control", "development charge"], gcb: ["good class bungalow"], da: ["development application"], qp: ["qualified person"], cou: ["change of use"] },
    who: {
      buckets: [["pe", "No application", "Works URA lists as needing no permission"], ["either", "Plan lodgment", "Lodged by a qualified person"], ["architect", "Application to URA", "Assessed before work starts"]],
      headlineHtml: '<div class="note bad"><b>Planning permission comes first.</b> It decides whether the use, the floor area, the height and the position on the plot are allowed at all. BCA will not approve building plans for a development that has no planning permission.</div><div class="panel"><h3>Three routes</h3><div class="prose"><ul><li><b>No application.</b> URA lists minor works that need no permission, such as repainting, internal partitions and fences up to 1.8 m. The list does not apply to conserved buildings and conservation areas.</li><li><b>Plan lodgment.</b> If the works meet every guideline, a qualified person lodges the plans with a declaration and they are treated as authorised.</li><li><b>Development application.</b> Everything else is assessed by URA, which gives a provisional permission and then a written permission.</li></ul></div></div>',
      notesHtml: '<h3>Who can submit</h3><ul><li>The developer appoints a qualified person. URA names registered architects and professional engineers, and for some applications land surveyors. Which professions may submit which works is set by the Planning (Qualified Persons) Rules 2017, which were not read in full for this hub.</li><li>No qualified person is needed for minor works to a landed house or a single unit, for a change of use, or to renew a permission.</li><li>The qualified person must tell URA within 14 days of resigning or being terminated, and the developer within 7 days of a change.</li></ul>',
      options: [
        opt("paint", "Repainting, internal partitions, replacing windows or doors", "None needed", "pe", "No application", "On URA's list of works that need no planning permission, provided GFA and setbacks do not change.", "Not available for conserved buildings, conservation areas and national monuments.", EX, S.exempt, "renovation partition"),
        opt("fence", "Boundary wall or fence up to 1.8 m", "None needed", "pe", "No application", "On URA's list of works that need no planning permission.", "Higher walls need an application.", EX, S.exempt, "wall gate"),
        opt("add20", "Addition to a landed house of up to 20 m²", "None needed", "pe", "No application", "On URA's list, subject to its conditions.", "Check the conditions on URA's page before relying on it.", EX, S.exempt, "extension landed"),
        opt("temp", "Temporary structure for up to 90 days a year", "None needed", "pe", "No application", "On URA's list of works that need no planning permission.", "", EX, S.exempt, "tent event"),
        opt("landed_new", "New landed house that meets every guideline", "Qualified person lodges", "either", "Lodgment", "New landed houses are within the Plan Lodgment Scheme. The QP declares full compliance and the lodgment is treated as authorised.", "Lodgment fee S$1,000. Valid for 2 years.", "URA, Plan lodgment", S.lodge, "bungalow terrace semi-detached rebuild"),
        opt("landed_aa", "Additions and alterations to a landed house", "Qualified person lodges", "either", "Lodgment", "Landed A&A is within the Plan Lodgment Scheme where it meets the guidelines.", "Lodgment fee S$700. A minor A&A application costs S$600 and needs no QP.", "URA, Plan lodgment", S.lodge, "extension attic"),
        opt("ind", "Industrial or warehouse works that meet the guidelines", "Qualified person lodges", "either", "Lodgment", "Industrial, warehouse and workers' dormitory works are within the Plan Lodgment Scheme.", "Secondary uses such as canteens, showrooms, childcare and dormitories were excluded by the 2015 circular.", "URA, Plan lodgment; circular DC15-01", S.lodge, "factory b1 b2"),
        opt("sub", "Subdivision of land or a building", "Qualified person", "either", "Lodgment or application", "Subdivision needs subdivision permission, and is also listed under the Plan Lodgment Scheme.", "Fee S$1,500 for land, S$2,000 for a building, as read from the schedule.", "Planning Act 1998 s 12(3); URA, Plan lodgment", S.lodge, "strata amalgamation"),
        opt("new", "New flats, condominium, commercial or mixed-use building", "Qualified person", "architect", "Full application", "Assessed by URA as a development application, through the Design Gateway under CORENET X for projects of 5,000 m² GFA and above.", "Fee from S$3,500 for the first 1,000 m² of GFA.", "URA, Planning permission", S.main, "apartment office shop"),
        opt("cou", "Change of use of existing premises", "No QP needed", "architect", "Application", "A material change of use is development. The court treated running a restaurant as a bar as a change of use.", "Fee S$500.", "Planning Act 1998 s 3; PP v Project Lifestyle [2015] SGHC 251", S.pl, "restaurant bar office shop"),
        opt("exceed", "Proposal above the approved plot ratio or height, or a use not in the Master Plan", "Qualified person", "architect", "Outline first", "An outline application tests the use, plot ratio or height before detailed design.", "Fee is 50% of the formal application fee and is not offset against it.", "URA, Outline application", S.outline, "rezoning intensification"),
        opt("cons", "Any works to a conserved building", "Architect or engineer", "architect", "Conservation permission", "Works in a conservation area need conservation permission, and the exemption list does not apply.", "Demolishing a conserved building carries up to S$500,000, 12 months' jail, or both.", "Planning Act 1998 s 12(2); URA Conservation Guidelines", S.cons, "shophouse heritage"),
        opt("stay", "Letting a private home for less than 3 months, or to more than 6 unrelated people", "Not applicable", "architect", "Not allowed without permission", "URA enforces a minimum stay of three consecutive months and a limit of six unrelated occupants for private homes.", "Fines of up to S$200,000 a charge have been imposed.", "URA media releases, 2024 and 2025", S.sta, "airbnb dormitory short-term")
      ]
    },
    lanes: ["Project team", "URA", "SLA", "Minister"],
    tracks: [{ id: "new", label: "New development, full application" }, { id: "lodge", label: "Landed house by lodgment" }, { id: "cou", label: "Change of use" }, { id: "outline", label: "Outline application first" }],
    steps: [
      { id: "u-site", col: 0, lanes: [0, 0], untimed: true, title: "Site check", tracks: ["new", "lodge", "cou", "outline"], agency: "Developer", lead: "Developer, with the QP", status: "verified",
        what: ["Master Plan zoning and gross plot ratio.", "Height or storey control, landed housing area type, conservation status.", "Road category and road reserve line, drainage reserve.", "The approved use of existing premises."],
        out: ["The allowable GFA, the storey limit and the buildable area, before any design."], hurdles: ["Designing to the gross site area when part of it is vested for road widening.", "Buying half of a semi-detached pair to build a detached house."],
        ask: ["What is the Master Plan GPR and zoning?", "What category is the road in front?", "Is the site in a conservation area or a Good Class Bungalow Area?"], ref: "URA GFA Handbook; URA SPACE", src: S.gfa },
      { id: "u-qp", col: 1, lanes: [0, 0], untimed: true, title: "Appoint the qualified person", tracks: ["new", "lodge", "outline"], agency: "Developer", lead: "Developer", status: "verified",
        what: ["A qualified person to prepare the plans, submit and supervise.", "Owner's written consent if the applicant is not the owner."], out: ["One QP answerable to URA for the plans and the declaration."],
        hurdles: ["No QP appointed to supervise. At 32 Desker Road this was a charge taken into consideration."], ask: ["Who is the QP for planning, and is it the same person as for BCA?"], ref: "Planning (Qualified Persons) Rules 2017; URA circular DC17-05", src: S.qp },
      { id: "u-pacs", col: 1, lanes: [2, 2], untimed: true, title: "Pre-application consultation (optional)", tracks: ["new", "outline"], agency: "URA", lead: "QP", status: "verified",
        what: ["A paid consultation with URA before submitting."], out: ["URA's early view on the proposal."], hurdles: ["Treating the consultation as an approval."], ask: ["Is the scheme unusual enough to be worth consulting on first?"],
        ref: "URA Development Control Fee Schedule, Table 6", src: FEE },
      { id: "u-outline", col: 2, lanes: [2, 2], tatMin: 20, tatMax: 20, tatNote: "generally 20 working days", title: "Outline application", tracks: ["outline"], agency: "URA", lead: "QP", status: "verified",
        what: ["The proposed use, plot ratio or building height."], out: ["Outline permission, which may be extended once."], hurdles: ["Skipping it when the scheme exceeds the Master Plan, then being refused at the full application."],
        ask: ["Does the scheme exceed the approved GPR or height, or change the use from the Master Plan?"], ref: "URA, Outline application", src: S.outline },
      { id: "u-lodge", col: 2, lanes: [2, 2], untimed: true, title: "Plan lodgment", tracks: ["lodge"], agency: "URA", lead: "QP", status: "verified",
        what: ["Plans with the QP's declaration of full compliance with the development control and lodgment guidelines."], out: ["The works are treated as authorised. Valid for 2 years, extendable."],
        hurdles: ["One guideline missed makes the whole lodgment invalid.", "The QP or firm can be barred for a wrong declaration."], ask: ["Does every dimension meet the guideline with no waiver?"], ref: "URA, Plan lodgment", src: S.lodge },
      { id: "u-cou", col: 2, lanes: [2, 2], untimed: true, title: "Change of use application", tracks: ["cou"], agency: "URA", lead: "Owner or tenant", status: "verified",
        what: ["The existing approved use and the proposed use.", "Owner's consent."], out: ["Permission for the new use, often for a limited period."], hurdles: ["Starting the new use before permission, then paying the retention fee and a civil penalty."],
        ask: ["What is the approved use on record?"], ref: "URA Development Control Fee Schedule, Table 4", src: FEE },
      { id: "u-da", col: 3, lanes: [2, 2], tatMin: 20, tatMax: 20, tatNote: "20 working days per gateway is BCA's stated target for the joint reply", title: "Development application", tracks: ["new", "outline"], agency: "URA", lead: "QP", status: "unverified",
        what: ["Site plan, floor plans, sections and elevations with GFA and strata boundaries.", "GFA computation and the deviation list.", "Under CORENET X, the Design Gateway model for land use, intensity, massing, site layout and access."],
        out: ["Provisional permission with conditions, or a refusal."], hurdles: ["GFA boundaries or strata boundaries missing from the floor plans.", "An urban design checklist left out where one is mandatory."],
        ask: ["Is the project 5,000 m² GFA or more, so CORENET X is mandatory?", "Has the GFA been computed to the wall centre line?"], ref: "URA circular DC23-07; URA, Submission checklist", src: S.cx },
      { id: "u-pp", col: 4, lanes: [2, 2], untimed: true, title: "Provisional permission", tracks: ["new", "outline"], agency: "URA", lead: "QP", status: "verified",
        what: ["Resubmission addressing every condition."], out: ["A provisional permission lapses 6 months from the day it is granted."], hurdles: ["Letting it lapse while other agencies' comments are outstanding.", "Resubmission fees from the second resubmission."],
        ask: ["When does the provisional permission lapse?"], ref: "URA, Extend planning permission", src: S.extend },
      { id: "u-lbc", col: 5, lanes: [2, 2], untimed: true, title: "Land Betterment Charge", tracks: ["new", "outline", "cou"], agency: "SLA", lead: "Developer", status: "verified",
        what: ["No separate application. SLA issues a liability order if the approval raises the land value."], out: ["Payment due within 1 month of the liability order, with a S$1,100 database fee."],
        hurdles: ["Not budgeting for it when adding GFA or changing to a higher-value use.", "The choice of the valuation method must be made within one week and cannot be undone."], ask: ["Does the proposal add GFA or change the use group?"], ref: "Land Betterment Charge Act 2021; URA circular DC22-08", src: S.lbc },
      { id: "u-wp", col: 6, lanes: [2, 2], untimed: true, title: "Written permission", tracks: ["new", "outline"], agency: "URA", lead: "QP", status: "verified",
        what: ["Final plans once the conditions are met."], out: ["A written permission lapses 2 years from the day it is granted."], hurdles: ["Applying to extend less than 2 months before expiry."], ask: ["When does the written permission lapse, and has work started?"],
        ref: "URA, Extend planning permission", src: S.extend },
      { id: "u-build", col: 7, lanes: [0, 0], untimed: true, title: "Build to the approved plans", tracks: ["new", "lodge", "outline"], agency: "Developer", lead: "Supervising QP", status: "verified",
        what: ["The QP supervises against the written permission plans.", "Any change goes back to URA as an amendment before it is built."], out: ["A building within a 3% construction tolerance of the approved plans."],
        hurdles: ["Site changes to footprint, height or setbacks made without an amendment."], ask: ["Has anything changed on site since the written permission?"], ref: "URA circular DC17-05", src: S.qp },
      { id: "u-decl", col: 8, lanes: [0, 0], untimed: true, title: "QP's declaration before TOP", tracks: ["new", "lodge", "outline"], agency: "URA", lead: "Supervising QP", status: "verified",
        what: ["A declaration that the building was built to the written permission plans, on nine parameters including footprint, setbacks, height and storeys."], out: ["Clearance for TOP on the planning side."],
        hurdles: ["A significant deviation found at the end, when it is most expensive to fix."], ask: ["Has the as-built survey been checked against the approved plans?"], ref: "URA circular DC17-05", src: S.qp },
      { id: "u-appeal", col: 9, lanes: [2, 2], untimed: true, title: "If refused: appeal", tracks: ["new", "lodge", "cou", "outline"], agency: "Minister for National Development", lead: "Applicant", status: "unverified",
        what: ["An appeal to the Minister within 60 days of URA's decision."], out: ["The Minister's decision, which is final."], hurdles: ["Going to court instead. In Borissik the court dismissed the case because the appeal had not been used."],
        ask: ["What date was the refusal notified?"], ref: "Planning Act 1998 s 22; Borissik v URA [2009] SGHC 154", src: S.bor }
    ],
    processNotesHtml: '<h3>How to read the times</h3><ul><li>URA publishes a time only for outline applications, at about 20 working days. The 20 working days shown for a development application is BCA\'s target for the joint agency reply at each CORENET X gateway, not a URA service standard.</li><li>A lodgment has no waiting time because URA does not assess it first. The risk moves to the qualified person\'s declaration.</li><li>The Land Betterment Charge is a separate step with its own one-month deadline, run by SLA.</li></ul>',
    fees: {
      fields: [
        { id: "type", label: "Application", type: "select", options: [["new", "New building: flats, commercial, industrial"], ["landed", "New landed house, full application"], ["lodge_new", "Plan lodgment, new landed house"], ["lodge_aa", "Plan lodgment, landed A&A"], ["minor", "Minor A&A to a landed house or strata unit"], ["cou", "Change of use"], ["ext", "Extension of a PP or WP"]], def: "new" },
        { id: "gfa", label: "Proposed GFA (m²), new building only", type: "number", def: 3000 },
        { id: "group", label: "Fee group, new building only", type: "select", options: [["a", "Group A: $200 per extra 100 m²"], ["b", "Group B: $100 per extra 100 m²"]], def: "a" },
        { id: "gcba", label: "In a Good Class Bungalow Area", type: "select", options: [["n", "No"], ["y", "Yes"]], def: "n" },
        { id: "outline", label: "Outline application only", type: "select", options: [["n", "No"], ["y", "Yes"]], def: "n" },
        { id: "nth", label: "Which extension (1st, 2nd, 3rd...)", type: "number", def: 1 }
      ],
      items: [
        { id: "ura-fee", agency: "URA", label: "Processing fee", status: "verified", ref: "URA Development Control Fee Schedule (updated Sep 2024)", src: FEE,
          desc: "New building: $3,500 for the first 1,000 m² of GFA, then $200 or $100 for each further 100 m² by fee group. New landed house: $6,000, or $8,000 in a Good Class Bungalow Area. Plan lodgment: $1,000 new, $700 A&A. Minor A&A $600. Change of use $500. Extension $500 for the first and second, rising by $1,000 from the third. An outline application is 50% of the formal fee. Under CORENET X half is paid at the Design Gateway and half at the Construction Gateway.",
          calc: function (p) {
            var t = p.type, half = p.outline === "y", r;
            if (t === "new") { var g = p.gfa || 0, rate = p.group === "b" ? 100 : 200, extra = up(g - 1000); r = { amount: 3500 + extra * rate, basis: "$3,500 for the first 1,000 m²" + (extra ? " + " + extra + " x $" + rate : "") }; }
            else if (t === "landed") r = p.gcba === "y" ? { amount: 8000, basis: "Landed house in a Good Class Bungalow Area" } : { amount: 6000, basis: "Landed house outside a Good Class Bungalow Area" };
            else if (t === "lodge_new") return { amount: 1000, basis: "Plan lodgment, new landed house" };
            else if (t === "lodge_aa") return { amount: 700, basis: "Plan lodgment, landed A&A" };
            else if (t === "minor") return { amount: 600, basis: "Minor A&A" };
            else if (t === "cou") return { amount: 500, basis: "Change of use" };
            else { var n = Math.max(1, Math.round(p.nth || 1)); return { amount: n <= 2 ? 500 : 500 + 1000 * (n - 2), basis: n <= 2 ? "1st or 2nd extension" : "Extension " + n + ": $500 + $1,000 x " + (n - 2) + ", as read from Table 5" }; }
            if (half) return { amount: r.amount / 2, basis: "Outline: 50% of (" + r.basis + ")" };
            return r;
          } },
        { id: "ura-lbc", agency: "SLA", label: "Land Betterment Charge", status: "verified", ref: "Land Betterment Charge Act 2021", src: S.sla,
          desc: "Not estimated here. It depends on the use group and the sector, from SLA's table of rates, which is revised every March and September. Look it up on SLA's site or OneMap.",
          calc: function () { return { amount: 0, basis: "Assessed by SLA; not included in this total" }; } }
      ],
      notesHtml: '<h3>What this estimate leaves out</h3><ul><li>The Land Betterment Charge, which can be far larger than the processing fee where GFA is added or the use changes.</li><li>Resubmission fees of 50% from the second resubmission, or the third under CORENET X.</li><li>Pre-application consultation: $2,180 for one to four landed houses in designated areas, $3,270 for other developments under 10,000 m² outside them, and $5,450 for 10,000 m² and above.</li><li>Whether the schedule\'s figures include GST was not confirmed. Which uses fall in fee group A or B is set out in the schedule.</li></ul>'
    },
    facts: [
      { id: "name", label: "Project name or address", type: "text" },
      { id: "type", label: "Type of works", type: "select", options: [["landed_new", "New landed house"], ["landed_aa", "Landed house A&A"], ["flats", "Flats or condominium"], ["ind", "Industrial or warehouse"], ["comm", "Commercial or mixed use"], ["cou", "Change of use only"], ["cons", "Conserved building"]], def: "landed_new" },
      { id: "zone", label: "Master Plan zoning", type: "text" },
      { id: "gpr", label: "Master Plan GPR", type: "number" },
      { id: "site", label: "Nett site area (m²)", type: "number" },
      { id: "gfa", label: "Proposed GFA (m²)", type: "number" },
      { id: "storeys", label: "Storeys", type: "number" },
      { id: "road", label: "Road category in front", type: "select", options: [["", "Not known"], ["1", "Category 1"], ["2", "Category 2"], ["3", "Category 3"], ["4", "Category 4"], ["5", "Category 5"]], def: "" },
      { id: "gcba", label: "Good Class Bungalow Area", type: "select", options: [["n", "No"], ["y", "Yes"]], def: "n" }
    ],
    pathway: function (p) {
      var out = [], gpr = p.gpr || 0, site = p.site || 0, gfa = p.gfa || 0, st = p.storeys || 0, fmt = function (n) { return Math.round(n).toLocaleString("en-SG"); };
      if (gpr && site && gfa) {
        var allow = gpr * site;
        if (gfa > allow * 1.1) out.push({ level: "bad", text: "Proposed GFA " + fmt(gfa) + " m² is more than 10% above the " + fmt(allow) + " m² the Master Plan GPR allows. Bonus schemes cannot cover it: test it with an outline application first.", ref: "URA Handbook, Bonus GFA" });
        else if (gfa > allow) out.push({ level: "warn", text: "Proposed GFA " + fmt(gfa) + " m² exceeds the " + fmt(allow) + " m² allowed by " + (((gfa / allow) - 1) * 100).toFixed(1) + "%. Only bonus GFA schemes, capped at 10% in total, can cover the excess.", ref: "URA Handbook, Bonus GFA" });
        else out.push({ level: "info", text: "Proposed GFA " + fmt(gfa) + " m² is within the " + fmt(allow) + " m² the Master Plan GPR allows.", ref: "URA GFA Handbook" });
      }
      var t = { landed_new: ["info", "A new landed house that meets every guideline can go by plan lodgment. One departure and it needs a full application.", "URA, Plan lodgment"], landed_aa: ["info", "Landed A&A can go by plan lodgment where it meets the guidelines. Minor A&A needs no qualified person.", "URA, Plan lodgment"],
        flats: ["warn", "A full development application. Storeys are guided by the plot ratio and site coverage is capped at 50%.", "URA Handbook, Flats and condominiums"], ind: ["info", "At least 60% of GFA must be industrial use. Works that meet the guidelines can go by plan lodgment.", "URA Handbook, Business 1"],
        comm: ["warn", "A full development application. Check for an urban design guide plan covering the site.", "URA, Submission checklist"], cou: ["info", "Change of use: a S$500 application and no qualified person needed. Do not start the new use first.", "URA Fee Schedule"],
        cons: ["bad", "Conserved building: conservation permission is needed and the exemption list does not apply. Unauthorised demolition carries up to S$500,000, 12 months' jail, or both.", "Planning Act 1998 s 12"] }[p.type];
      if (t) out.push({ level: t[0], text: t[1], ref: t[2] });
      if ((p.type === "landed_new" || p.type === "landed_aa") && st > 3) out.push({ level: "warn", text: "Landed housing areas are 2-storey or 3-storey, with an envelope of 12 m or 15.5 m. " + st + " storeys will not fit.", ref: "URA, Clarifications on landed housing guidelines" });
      if (p.type === "flats" && gpr && st) { var cap = gpr <= 1.4 ? 5 : gpr <= 1.6 ? 12 : gpr <= 2.1 ? 24 : gpr <= 2.8 ? 36 : 0; if (cap && st > cap) out.push({ level: "warn", text: "At GPR " + gpr + " the storey guide is " + cap + ". " + st + " storeys is above it.", ref: "URA Handbook, building height" }); }
      if (p.gcba === "y") out.push({ level: "info", text: "Good Class Bungalow Area: plot of at least 1,400 m², 18.5 m wide and 30 m deep, with 3 m side and rear setbacks.", ref: "URA, Prevailing planning controls" });
      if (!out.length) out.push({ level: "info", text: "Enter the Master Plan GPR, nett site area and proposed GFA to test the intensity.", ref: "" });
      return out;
    },
    scopes: [{ id: "all", label: "All URA rule sets" }, { id: "gfa", label: "GFA and intensity" }, { id: "landed", label: "Landed housing" }, { id: "flats", label: "Flats and condominiums" }, { id: "nonres", label: "Industrial and commercial" }, { id: "cons", label: "Conservation" }, { id: "sub", label: "Submission" }],
    playbook: [
      { stage: "1. Site check", ask: ["Master Plan zoning, GPR and height control.", "Road category, road reserve and drainage reserve lines.", "Approved use of any existing building."], check: ["Nett site area after vesting.", "Whether the site is in a conservation area or a landed housing area."], chase: ["A recent topographical and boundary survey.", "Title and any restrictive covenants."] },
      { stage: "2. Route and appointments", ask: ["Lodgment, full application, or outline first?", "Who is the qualified person for planning?"], check: ["Every guideline is met before choosing lodgment.", "The QP's scope covers supervision and the completion declaration."], chase: ["Owner's written consent.", "The QP's appointment in writing."] },
      { stage: "3. Preparing the application", ask: ["GFA computed to the wall centre line, with strata boundaries.", "A list of every deviation and the reason."], check: ["Setbacks from the road reserve line, not the kerb.", "Storeys and floor-to-floor heights against the guide."], chase: ["Frozen floor plans before GFA is computed.", "The urban design checklist where one applies."] },
      { stage: "4. Provisional permission", ask: ["The list of conditions and who answers each."], check: ["The lapse date, 6 months from grant.", "Whether a resubmission will attract a fee."], chase: ["Other agencies' comments holding up the resubmission."] },
      { stage: "5. Land Betterment Charge", ask: ["Has SLA issued a liability order?"], check: ["The one-month payment deadline.", "Whether the valuation method should be chosen, within one week."], chase: ["The developer's payment."] },
      { stage: "6. Written permission to construction", ask: ["The lapse date, 2 years from grant.", "Any site change since approval."], check: ["An extension is applied for at least 2 months before expiry.", "Changes go to URA as an amendment before they are built."], chase: ["The builder's setting-out survey."] },
      { stage: "7. Completion", ask: ["The as-built survey."], check: ["Footprint, setbacks, height and storeys are within 3% of the approved plans."], chase: ["The supervising QP's declaration before TOP."] }
    ],
    entries: terms.concat(rules, process, hurdles)
  };

  window.URANUM = [
    ["6 months", "", "A provisional permission lapses", "", "URA, Extend planning permission", "provisional permission"],
    ["2 years", "", "A written permission lapses", "", "URA, Extend planning permission", "written permission"],
    ["60 days", "", "To appeal to the Minister after a refusal", "", "Planning Act 1998 s 22", "appeal"],
    ["S$200,000", "", "Maximum fine for development without permission", "", "Planning Act 1998 s 12", "penalty"],
    ["10%", "", "Most bonus GFA allowed above the Master Plan plot ratio", "", "URA Handbook, Bonus GFA", "bonus GFA"],
    ["50%", "", "Maximum site coverage for flats and condominiums", "", "URA Handbook, site coverage", "site coverage"],
    ["12 m", "", "Envelope height in a 2-storey landed area; 15.5 m in a 3-storey area", "", "URA landed housing guidelines", "envelope height"],
    ["7.5 m", "", "Road buffer for a landed house on a Category 3 to 5 road", "", "URA Handbook, Bungalows", "road buffer"],
    ["2 m", "", "Side and rear setback of a landed house", "", "URA Handbook, Bungalows", "side and rear setbacks"],
    ["400 m²", "", "Minimum plot for a detached house", "", "URA, Prevailing planning controls", "plot size"],
    ["60/40", "", "Industrial use against ancillary use in a B1 or B2 building", "", "URA Handbook, Business 1", "60/40"],
    ["1 month", "", "To pay the Land Betterment Charge after the liability order", "", "URA circular DC22-08", "land betterment charge"]
  ];

  window.URASTATS = {
    quotes: {
      hammurabi: { pic: "stamp", n: "s 12", nl: "the one line the whole planning system hangs on", lead: "Permission comes before the first brick", text: "A person must not, without planning permission, carry out or permit the carrying out of any development.", paraphrase: true, by: "Planning Act 1998, section 12(1)", src: ACT },
      fire: { pic: "gavel", n: "60 days", nl: "to appeal to the Minister after URA refuses", lead: "The appeal comes before the court", text: "An owner who went to court without first appealing to the Minister could not get URA's refusal reopened.", paraphrase: true, by: "Borissik Svetlana v Urban Redevelopment Authority [2009] SGHC 154", src: S.bor },
      thai: { pic: "collapse", n: "S$250,000", nl: "fine for demolishing the front of a conserved shophouse, 2026", lead: "Conserved buildings carry the heaviest penalty", text: "Up to $500,000 in fines, up to 12 months' imprisonment, or both.", paraphrase: true, by: "URA media release on 32 Desker Road, 22 April 2026", src: S.desker },
      bca: { pic: "money", n: "S$1.27M", nl: "total fines on six men for illegal short-term stays, 2025", lead: "Use is controlled as tightly as building", text: "The minimum stay duration for private residential properties is three consecutive months.", paraphrase: true, by: "URA media release, 15 September 2025", src: S.sta }
    },
    tilesTitle: "Planning control in numbers", tilesSub: "What the rules cost when they are ignored, and what they ask for when they are followed.",
    tiles: [
      { n: "S$200,000", label: "maximum fine on each charge of unauthorised development or use", year: "current", by: "Planning Act 1998 s 12", src: ACT },
      { n: "S$600,000", label: "record fine on one man for running three homes as workers' dormitories", year: "2024", by: "URA media release", src: S.dorm },
      { n: "31", label: "private homes sublet by the night by one man, fined S$1.14 million", year: "2025", by: "URA media release", src: S.sta },
      { n: "118", label: "sectors and 9 use groups in the Land Betterment Charge table of rates", year: "Sep 2026", by: "SLA", src: S.sla },
      { n: "5,000 m²", label: "GFA at which CORENET X became mandatory for new projects on 1 Oct 2026", year: "2026", by: "URA circular DC26-08", src: S.cx26 },
      { n: "3%", label: "construction tolerance in the QP's declaration before TOP", year: "since 2017", by: "URA circular DC17-05", src: S.qp }
    ],
    seriesTitle: "", seriesSub: "", series: [],
    timeline: [
      { year: "2009", bad: true, event: "Borissik v URA", law: "An owner refused permission to break up a semi-detached pair loses in court, having skipped the appeal to the Minister.", by: "[2009] SGHC 154", src: S.bor },
      { year: "2015", bad: true, event: "A restaurant run as a bar in Kampong Glam", law: "The High Court raises the fine from S$20,000 to S$35,000 and treats persisting for profit as aggravating.", by: "PP v Project Lifestyle [2015] SGHC 251", src: S.pl },
      { year: "2017", event: "Qualified persons become answerable under the Planning Act", law: "The QP supervises against the approved plans and declares compliance before TOP, with a 3% tolerance.", by: "URA circular DC17-05", src: S.qp },
      { year: "2019", event: "Envelope control for landed houses", law: "URA controls the outer envelope, 12 m or 15.5 m, instead of each storey. Piloted in July 2019 and adopted in July 2021.", by: "URA landed housing guidelines", src: S.landed },
      { year: "2022", event: "Land Betterment Charge", law: "One charge under SLA replaces the development charge, the temporary development levy and the differential premium from 1 August.", by: "URA circular DC22-08", src: S.lbc },
      { year: "2023", event: "One way to measure floor area", law: "From 1 June, URA, SLA, BCA and SCDF all measure to the middle of the wall.", by: "URA circular DC22-09", src: S.harm },
      { year: "2024", bad: true, event: "Record dormitory fine", law: "S$600,000 for housing 15 to 17 workers in homes limited to six unrelated people.", by: "URA media release", src: S.dorm },
      { year: "2026", bad: true, event: "32 Desker Road", law: "S$250,000 and S$150,000 fines, with reinstatement, for demolishing parts of a conserved shophouse.", by: "URA media release", src: S.desker },
      { year: "2026", event: "CORENET X mandatory from 5,000 m²", law: "From 1 October new projects of 5,000 m² GFA and above go through the joint gateways.", by: "URA circular DC26-08", src: S.cx26 }
    ],
    disasters: null, db: null, systems: null
  };

  window.URACASES = [
    { stage: "Site check", tag: "2009 · Semi-detached pair", img: "img/case1.jpg", title: "She designed a bungalow the plot next door could not allow", when: "2009", where: "2 Jalan Chengam",
      story: [["draft", "The owner of one half of a semi-detached pair applies to demolish it and build a detached house."], ["nostamp", "URA refuses. The neighbour's plot left behind is 244.5 m², below the 400 m² a detached house needs."], ["gavel", "She goes to court without appealing to the Minister. The High Court dismisses the case."]],
      big: [["244.5 m²", "the plot that would be left behind"], ["400 m²", "minimum for a detached house"], ["60 days", "to appeal to the Minister"]],
      lesson: "Check what a redevelopment leaves the neighbour with before anyone buys or designs. If URA refuses, the appeal to the Minister comes first and has a deadline.", src: [["Borissik Svetlana v URA [2009] SGHC 154", S.bor]] },
    { stage: "Change of use", tag: "2015 · Kandahar Street", img: "img/case3.jpg", title: "The restaurant that was really a bar", when: "2015", where: "32 Kandahar Street, Kampong Glam",
      story: [["occupy", "Premises approved as a restaurant in a conservation area are run as a bar."], ["gavel", "The operator is charged under the Planning Act and fined S$20,000."], ["money", "On appeal the High Court raises the fine to S$35,000."]],
      big: [["S$35,000", "fine after the appeal"], ["S$20,000", "the original fine"], ["S$5,000 to S$10,000", "the usual starting range, per the court"]],
      lesson: "A change of use is development even when nothing is built. Check the approved use on record before a tenant fits out, and apply before trading.", src: [["PP v Project Lifestyle Pte Ltd [2015] SGHC 251", S.pl]] },
    { stage: "Use", tag: "2024 · Workers in private homes", img: "img/case6.jpg", title: "Seventeen workers in a house approved for six", when: "June 2024", where: "Private homes, Singapore",
      story: [["occupy", "Private homes are used to house 15 to 17 workers each."], ["nostamp", "A private home may house up to six unrelated people. No permission for dormitory use was sought."], ["money", "Three charges proceed with eight more taken into consideration, each at the maximum."]],
      big: [["S$600,000", "total fine, a record"], ["6", "unrelated people allowed in a private home"], ["15 to 17", "workers found in each home"]],
      lesson: "Dormitory use of a home is a separate, heavier offence. A client asking for more rooms and bathrooms than a family needs is a question to ask.", src: [["URA media release, 14 June 2024", S.dorm]] },
    { stage: "Conservation", tag: "2026 · 32 Desker Road", img: "img/case4.jpg", title: "The shophouse front that was taken down", when: "April 2026", where: "32 Desker Road, Little India",
      story: [["collapse", "The front, the rear facade and the service block of a conserved shophouse are demolished for a co-living conversion."], ["nostamp", "There is no conservation permission, and no qualified person was appointed to supervise."], ["money", "The individual is fined S$250,000 and the owner company S$150,000, and the building must be reinstated."]],
      big: [["S$250,000", "fine on the individual"], ["S$150,000", "fine on the owner, plus reinstatement"], ["S$500,000", "maximum for demolishing a conserved building"]],
      lesson: "On a conserved building, structural convenience is never a reason to remove fabric. Get conservation permission and a supervising qualified person before any demolition.", src: [["URA media release, 22 April 2026", S.desker]] },
    { stage: "Use", tag: "2025 · Short-term stays", img: "img/case7.jpg", title: "Thirty-one homes let by the night", when: "September 2025", where: "Private homes, Singapore",
      story: [["occupy", "Thirty-one private homes are sublet through booking platforms between 2019 and 2021."], ["clock", "The minimum stay for a private home is three consecutive months."], ["money", "One man is fined S$1,144,902.10 on 31 charges. Five others are fined S$8,000 to S$32,500."]],
      big: [["S$1.27M", "total fines on six men"], ["31", "homes"], ["3 months", "minimum stay"]],
      lesson: "The Planning Act controls how a building is used, not only how it is built. Unauthorised use is fined per unit.", src: [["URA media release, 15 September 2025", S.sta]] }
  ];

  var BY = "Compiled from URA's handbooks, checklists and circulars. URA does not publish a list of refusal reasons.";
  window.URAMIST = [
    { id: "site", name: "Site check", by: BY, src: S.landed, items: [
      ["Using the gross site area", "Plot size and site coverage are assessed on the nett area after road widening and drainage reserve are vested.", "mismatch"],
      ["Measuring from the kerb", "The road buffer is measured from the road reserve line, which can sit well inside the fence.", "draft"],
      ["Not checking the road category", "The buffer runs from 7.5 m to 30 m depending on the category of the road in front.", "check"],
      ["Half of a semi-detached pair", "A detached house is refused if the plot left behind is too small for one. This was the Borissik case.", "gavel"]] },
    { id: "gfa", name: "GFA and intensity", by: BY, src: S.gfam, items: [
      ["GFA drawn to the inside face", "Since 1 June 2023 it is measured to the middle of the external wall.", "mismatch"],
      ["No strata boundaries", "URA says missing strata boundaries on floor plans may delay approval.", "nostamp"],
      ["Treating the plot ratio as a right", "The Master Plan GPR is an upper bound. Setbacks, height and plot shape can make it unachievable.", "check"],
      ["Counting on more than 10% bonus", "All bonus GFA schemes together are capped at 10% of the Master Plan GPR.", "extra"],
      ["Forgetting what counts", "Bay windows, balconies outside the scheme, and strata AC ledges are all GFA.", "extra"]] },
    { id: "landed", name: "Landed houses", by: BY, src: S.bung, items: [
      ["Roof terrace at the top of the envelope", "An accessible roof terrace must be at least 3 m below the top of the envelope.", "mismatch"],
      ["Car porch too deep or too wide", "It may go 2.4 m into the buffer for the first 3 m of width on Category 3 to 5 roads.", "draft"],
      ["Eaves over the setback", "Eaves may come to within 1 m of the side and rear boundaries, or 1.6 m in a Good Class Bungalow Area.", "check"],
      ["Lodging with one departure", "A lodgment is only valid if every guideline is met. One waiver means a full application.", "falsedoc"]] },
    { id: "sub", name: "Submission", by: BY, src: S.check, items: [
      ["No owner's consent", "An applicant who is not the owner needs the owner's written consent first.", "nostamp"],
      ["Deviations not declared", "Every non-compliant item belongs in the deviation annex with a reason.", "falsedoc"],
      ["Urban design checklist left out", "Where a site has urban design guidelines, the checklist is mandatory in the first submission.", "nostamp"],
      ["Renaming replacement files", "URA's guidance says changing the file names of replacement documents causes rejection.", "mismatch"]] },
    { id: "after", name: "After permission", by: BY, src: S.extend, items: [
      ["Letting the permission lapse", "A provisional permission lasts 6 months and a written permission 2 years.", "clock"],
      ["Extending too late", "Apply at least 2 months before the written permission expires.", "clock"],
      ["Changing it on site", "Footprint, setbacks, height and storeys must stay within 3% of the approved plans, or go back as an amendment.", "mismatch"],
      ["Missing the Land Betterment Charge", "It is due within 1 month of SLA's liability order.", "money"]] },
    { id: "use", name: "Use", by: BY, src: S.sta, items: [
      ["Starting the new use first", "A change of use is development. Keeping an unauthorised use costs a retention fee and a civil penalty.", "occupy"],
      ["More than six unrelated occupants", "Beyond six it is dormitory use, a heavier offence.", "occupy"],
      ["Stays under three months", "Short-term letting of private homes is an offence, fined per unit.", "clock"],
      ["Ancillary use over 40%", "In a B1 or B2 building at least 60% of GFA must be industrial.", "extra"]] }
  ];

  window.URAQUIZ = [
    ["Permission", "How long does a provisional permission last?", "6 months", ["3 months", "1 year", "2 years"], "It lapses 6 months from the day it is granted.", "URA, Extend planning permission"],
    ["Permission", "How long does a written permission last?", "2 years", ["6 months", "1 year", "5 years"], "It lapses 2 years from grant unless extended.", "URA, Extend planning permission"],
    ["Permission", "How early must an extension of a written permission be applied for?", "At least 2 months before expiry", ["Any time before expiry", "At least 2 weeks before", "Within 1 month after expiry"], "URA asks for at least 2 months.", "URA, Extend planning permission"],
    ["Permission", "After a refusal, how long is there to appeal to the Minister?", "60 days", ["14 days", "30 days", "6 months"], "In Borissik the owner went to court instead and lost.", "Planning Act 1998 s 22"],
    ["Intensity", "How is the allowable GFA worked out?", "Master Plan GPR times site area", ["Site area times storeys", "Site coverage times height", "GPR times building footprint"], "Gross plot ratio is GFA divided by site area.", "URA GFA Handbook"],
    ["Intensity", "What is the most bonus GFA allowed above the Master Plan GPR, all schemes together?", "10%", ["5%", "15%", "20%"], "And it does not carry over on redevelopment.", "URA Handbook, Bonus GFA"],
    ["Intensity", "Where is GFA measured to?", "The middle of the external wall", ["The inside face of the wall", "The outside face of the wall", "The edge of the slab"], "Harmonised across URA, SLA, BCA and SCDF from 1 June 2023.", "URA circular DC22-09"],
    ["Landed", "What is the envelope height in a 2-storey landed housing area?", "12 m", ["9 m", "10.5 m", "15.5 m"], "15.5 m applies in a 3-storey area.", "URA landed housing guidelines"],
    ["Landed", "What is the side and rear setback of a landed house outside a Good Class Bungalow Area?", "2 m", ["1 m", "3 m", "4.5 m"], "3 m in a Good Class Bungalow Area.", "URA Handbook, Bungalows"],
    ["Landed", "What is the minimum plot for a detached house?", "400 m² and 10 m wide", ["200 m² and 8 m wide", "300 m² and 10 m wide", "1,400 m² and 18.5 m wide"], "1,400 m² is the Good Class Bungalow plot.", "URA, Prevailing planning controls"],
    ["Landed", "What is the road buffer for a landed house on a Category 5 road?", "7.5 m", ["2 m", "5 m", "12 m"], "Measured from the road reserve line.", "URA Handbook, Bungalows"],
    ["Flats", "What is the maximum site coverage for flats and condominiums?", "50%", ["35%", "40%", "60%"], "Of the nett site area.", "URA Handbook, site coverage"],
    ["Flats", "At a plot ratio of 2.1, how many storeys does URA's guide give a residential site?", "24", ["12", "20", "36"], "1.4 gives 5, 1.6 gives 12, 2.8 gives 36.", "URA Handbook, building height"],
    ["Industrial", "In a B1 or B2 building, what share of GFA must be industrial use?", "At least 60%", ["At least 40%", "At least 50%", "At least 80%"], "The other 40% may be ancillary uses.", "URA Handbook, Business 1"],
    ["Money", "Who charges the Land Betterment Charge?", "SLA", ["URA", "BCA", "IRAS"], "It replaced the development charge and differential premium on 1 August 2022.", "Land Betterment Charge Act 2021"],
    ["Money", "How long is there to pay the Land Betterment Charge after the liability order?", "1 month", ["14 days", "3 months", "Before TOP"], "", "URA circular DC22-08"],
    ["Penalty", "What is the maximum fine for carrying out development without permission?", "S$200,000", ["S$20,000", "S$50,000", "S$1 million"], "Demolishing a conserved building carries up to S$500,000.", "Planning Act 1998 s 12"],
    ["Penalty", "How many unrelated people may live in a private home?", "6", ["4", "8", "10"], "More than that is dormitory use.", "URA media release, 2024"],
    ["Routes", "What makes a plan lodgment valid?", "Full compliance with every guideline, declared by the QP", ["URA's approval within 7 days", "The owner's signature alone", "A waiver for each departure"], "URA does not assess it first, so the QP carries the risk.", "URA, Plan lodgment"],
    ["Routes", "From 1 October 2026, at what GFA must a new project use CORENET X?", "5,000 m² and above", ["1,000 m² and above", "30,000 m² and above", "All projects"], "Smaller projects may use it voluntarily.", "URA circular DC26-08"]
  ];
})();
