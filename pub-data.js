/* PUB data set: surface water drainage, earth control measures, sewerage and sanitary works, water pipes.
   Researched 17 Nov 2026 from the Code of Practice on Surface Water Drainage (7th Ed, with Addendum No. 3 of April 2025),
   the Code of Practice on Sewerage and Sanitary Works (3rd Ed, March 2025), PUB's advisory on water pipes and PUB's pages.
   The statute website could not be read, so statute wording and penalty sections are marked unverified. Fee amounts were not retrieved. */
(function () {
  "use strict";
  var P = "https://www.pub.gov.sg/";
  var S = {
    swd: P + "-/media/PUB/PDF/Code-of-Practices-and-Submission-Guidelines/Surface-Water-Drainage/Code-of-Practice-on-Surface-Water-Drainage.pdf",
    ssw: P + "-/media/PUB/PDF/Code-of-Practice-on-Sewerage-and-Sanitary-Works-3rd-Edition--Mar-2025.pdf",
    wpa: "https://pub.gov.sg/-/media/PUB/PDF/WSN/PUB-WSN--CWD-Advisory-Prevention-of-Damage-to-Watermains-Jan-2025.pdf",
    ecm: P + "Professionals/Requirements/Earth-Control-Measures/ECM-Guidelines-for-Stakeholders", ecmpr: P + "Resources/News-Room/PressReleases/2024/11/ECM",
    flow: P + "Professionals/Requirements/Qualified-Persons/Building-Plan-Submission-Process-Flow/Submission-Process", svc: P + "AboutUs/ServiceCommitment",
    fee: "https://pub.gov.sg/Professionals/Requirements/Qualified-Persons/Building-Plan-Submission-Process-Flow/Application-Fees-for-Submission-of-Building-Plan-and-Water-Service-Works",
    bill: "https://www.mse.gov.sg/latest-news/opening-speech-at-second-reading-sewerage-drainage-amendment-bill/", annexb: P + "-/media/PUB/PDF/Annex-B--11-Nov-2024-Revised.pdf",
    wemp: P + "Public/WaterLoop/Water-Conservation/Mandatory-Water-Efficiency-Requirements", flood: P + "Public/KeyInitiatives/Flood-Resilience/About-Floods", floodd: "https://data.gov.sg/dataset/flood-prone-areas",
    pal: "https://idrawater.org/?p=10401", feng: "https://theindependent.sg/pub-imposes-s56500-fine-on-feng-ming-construction-for-damaging-water-main/", well: "https://wildsingaporenews.blogspot.com/2018/12/128-contractors-taken-to-task-since.html",
    sink: "https://mothership.sg/2026/06/tanjong-katong-sinkhole-charges/", mega: "https://www.theonlinecitizen.com/2019/06/11/company-fined-44500-for-unauthorised-excavation-works-and-damage-to-water-main"
  };
  var SWD = "Code of Practice on Surface Water Drainage, 7th Ed with Addendum 3, ", SSW = "Code of Practice on Sewerage and Sanitary Works, 3rd Ed, ";

  var rules = [
    /* drainage and platform levels */
    ["d-mpl", "drain", "Levels", "verified", "Minimum platform level, general developments", "The platform level is the highest of 4.0 m above Singapore Height Datum on the southern coast or 4.5 m on the northern coast, 300 mm above the adjacent road or ground level, or any level PUB specifies.", "Platform level and the adjacent road level on the site plan and sections.", SWD + "cl 2.1.1(a)", S.swd],
    ["d-mpl-com", "drain", "Levels", "verified", "Minimum platform level, commercial, industrial, institutional and multi-unit residential", "The highest of 4.0 m or 4.5 m SHD, 600 mm above the adjacent road or ground level, or 300 mm above the flood level PUB advises for critical sites.", "Platform level, adjacent road level and the development type.", SWD + "cl 2.1.1(b)", S.swd],
    ["d-mpl-sp", "drain", "Levels", "verified", "Minimum platform level, special facilities and links to underground MRT", "For special facilities, and developments linked directly or indirectly to underground special facilities such as MRT stations, the level is at least 1 m above the adjacent road or ground level.", "Any underground link to an MRT station or other special facility.", SWD + "cl 2.1.1(c)", S.swd],
    ["d-crest", "drain", "Levels", "verified", "Crest level at basement entrances and openings", "Every entrance, exit and opening to a basement or underground structure has a crest at least 150 mm above the minimum platform level for general developments, and 300 mm above it for all other types.", "Crest level at each ramp, staircase, lift and ventilation opening into the basement.", SWD + "cl 2.2", S.swd],
    ["d-me", "drain", "Levels", "verified", "Critical M&E at or above the platform level", "Critical mechanical and electrical equipment is placed at the minimum platform level or higher. If it is in a basement, the crest level rules apply to every opening.", "Location and level of substations, switch rooms, generators and pump rooms.", SWD + "cl 2.5", S.swd],
    ["d-below", "drain", "Levels", "verified", "Where the platform level cannot be met", "With PUB's approval the platform may be lower, but not below 3.5 m SHD on the southern coast or 4.0 m on the northern coast, and flood protection must give at least the same protection. Flood barriers are then needed at every entry, exit and opening.", "Flood barrier positions and heights at all openings.", SWD + "cl 2.1.2, 2.4", S.swd],
    ["d-reserve", "drain", "Reserve", "verified", "Nothing is built in a drain or drainage reserve", "No structure may be built within a drain or drainage reserve, and services may not be laid in one. A crossing needs PUB's approval. The reserve widths by drain size were not read for this hub.", "Drainage reserve lines on the site plan and anything drawn inside them.", SWD + "cl 5.1, 6.2", S.swd],
    ["d-size", "drain", "Drains", "verified", "Minimum drain sizes", "A roadside drain, including an entrance culvert, is at least 600 mm wide and deep inside. A common drain is at least 450 mm wide. A conduit drain through an intermediate terrace house is at least 300 mm in diameter. A box culvert across a road is at least 1.0 m.", "Drain sizes on the drainage plan and at the entrance culvert.", SWD + "cl 4.3, 4.5", S.swd],
    ["d-peak", "drain", "Runoff", "verified", "Peak runoff control from 0.2 hectares", "New erection or reconstruction on a site of 0.2 ha or more, and A&A affecting 0.2 ha or more, must hold peak runoff to a runoff coefficient of 0.55 for a 10-year storm of up to 4 hours. The calculation is endorsed by a PE (Civil).", "Site area, the peak runoff calculation, and the detention tank or other features.", SWD + "cl 7.1.5", S.swd],
    ["d-tank", "drain", "Runoff", "verified", "Detention tank", "The tank empties within 4 hours of a storm. A pumped tank has duty pumps plus one standby and a generator, discharges through a swan neck to the internal drain at ground level, and may not be combined with the basement pumped drainage system.", "Tank volume, outlet and overflow sizes, pump arrangement and discharge point.", SWD + "Appendix 6", S.swd],
    ["d-return", "drain", "Design", "verified", "Design storm return period", "10 years for a catchment under 100 ha, 25 years for 100 to 1,000 ha, and 50 years above 1,000 ha.", "Return period stated in the drainage calculation.", SWD + "cl 7.1.3", S.swd],
    ["d-c", "drain", "Design", "verified", "Runoff coefficients", "1.00 for roads and paved areas, 0.90 for urban areas and 0.45 for vegetated and pervious areas. A weighted coefficient is allowed. Addendum 3 replaced the older five-row table.", "Runoff coefficients used in the calculation.", SWD + "cl 7.1.2", S.swd],
    ["d-vel", "drain", "Design", "verified", "Drain velocity and freeboard", "Velocity is at least 1.0 m/s and at most 3.0 m/s in a concrete-lined drain, or 1.5 m/s in an earth stream. Freeboard is generally 15% of the drain depth.", "Velocities and freeboard in the hydraulic calculation.", SWD + "cl 7.3", S.swd],
    ["d-base", "drain", "Basement", "verified", "Basement drainage", "Water falling into the basement catchment is kept fully separate from surface drainage and pumped out through a swan neck at crest level. General developments need duty pumps plus one standby; all other types need a standby for every duty pump. A generator backs them up.", "Basement pump sump, number of pumps, and the swan neck level.", SWD + "cl 4.9, 10", S.swd],
    ["d-conn", "drain", "Drains", "verified", "Connection to the receiving drain", "The invert of a connecting drain is not lower than the benching level of the drain it joins. A 300 mm drop is good practice.", "Invert levels at the connection.", SWD + "cl 9.5", S.swd],
    /* earth control */
    ["e-tss", "ecm", "Limit", "unverified", "Silt discharge limit", "Water discharged from a site to the stormwater drainage system may not carry more than 50 milligrams per litre of total suspended solids.", "The discharge limit stated on the ECM plan.", "Sewerage and Drainage (Surface Water Drainage) Regulations, reg 4(1); " + SWD + "cl 6.3.1", S.swd],
    ["e-qecp", "ecm", "People", "verified", "The ECM plan is by a QECP and approved before earthworks", "A Qualified Erosion Control Professional, a practising PE who has completed the erosion and sediment control course, designs and endorses the ECM plan. The contractor obtains PUB's approval and puts the measures in place before earthworks start.", "QECP endorsement on the ECM plan.", SWD + "cl 6.3.3 to 6.3.6", S.swd],
    ["e-storm", "ecm", "Design", "verified", "ECM design storm", "Earth control measures and the holding pond or sump are designed for at least a 5-year storm. The stored water is treated and emptied within 10 hours after rain.", "Design storm and holding capacity on the ECM plan.", SWD + "cl 6.3.5, 6.3.7", S.swd],
    ["e-measures", "ecm", "Measures", "verified", "Required earth control measures", "A concrete-lined perimeter cut-off drain, a perimeter silt fence, intermediate silt traps, a holding pond or sump and a treatment plant, with bare surfaces covered and works sequenced. Silt traps that rely mainly on hardcore, granite chips or sand are not acceptable.", "Each measure shown on the ECM plan with its position.", SWD + "cl 6.3.7", S.swd],
    ["e-cctv", "ecm", "Monitoring", "verified", "CCTV monitoring from 0.2 hectares", "Sites of 0.2 ha and above are monitored continuously by CCTV linked to PUB's Silt Imagery Detection System, and the contractor must respond promptly to its alerts.", "CCTV positions at the discharge points.", SWD + "Addendum 3; PUB press release, 8 Nov 2024", S.ecmpr],
    ["e-inspect", "ecm", "Monitoring", "verified", "Inspection and audit", "The measures are inspected regularly and during or after every rain event. The QECP audits them at every stage of earthworks, and the reports are kept on site.", "Inspection regime on the ECM plan.", SWD + "cl 6.3.8, 6.3.9", S.swd],
    /* sewerage and sanitary */
    ["s-over", "sewer", "Sewers", "verified", "Nothing over a sewer or manhole", "No structure, object or building may be placed over or across a sewer or manhole without PUB's approval, and no manhole may be inside a building. Boundary walls, perimeter drains and lightweight demountable items are excepted.", "Sewer alignment and manholes against the building footprint.", SSW + "1.2.4", S.ssw],
    ["s-setback", "sewer", "Sewers", "verified", "Setback from a public sewer", "Measured from the outermost edge of the structure, including footings and overhangs, to the sewer centreline. Sewer up to 600 mm: 1.0 m where it is up to 3 m deep, 1.5 m from 3 to 5 m, 2.0 m deeper. Over 600 to 1,500 mm: half the diameter plus 2.5 m. Over 1,500 to 2,500 mm: plus 3 m. Over 2,500 mm: plus 4 m. Deep tunnel sewer: plus 6 m.", "Sewer diameter and depth, and the dimension from the footing edge to its centreline.", SSW + "1.2.4(b), Table 1", S.ssw],
    ["s-corr", "sewer", "Sewers", "verified", "Public sewer corridor", "On each side of the centreline: 40 m for the deep tunnel sewer, 20 m for a sewer of 900 mm or more, 10 m for a smaller sewer. Excavation deeper than 0.5 m, piling, ground works and any structure inside it need a POWS submission and a plan approved by PUB.", "Corridor lines on the site plan and the works inside them.", SSW + "2.1, Table 2", S.ssw],
    ["s-impact", "sewer", "Sewers", "verified", "Impact limits at a sewer", "Peak particle velocity not above 15 mm/s, crack width not above 0.1 mm, and average stress change and groundwater drawdown each not above 10 kPa. Displacement and percussion piling are not allowed within the setback of large sewers.", "Monitoring limits in the impact assessment.", SSW + "2.2.3, Table 3", S.ssw],
    ["s-util", "sewer", "Sewers", "verified", "Clearance between utilities and sewers", "A crossing keeps at least 1 m of vertical clearance and a parallel utility 1 m horizontally. A utility may not run parallel above a sewer.", "Utility crossings and clearances on the services plan.", SSW + "1.2.4(c), 1.2.5", S.ssw],
    ["s-design", "sewer", "Sewer design", "verified", "Sewer velocity and size", "Velocity is between 0.9 and 2.4 m/s. The minimum sewer is 200 mm. A pumping main is at least 100 mm.", "Sewer sizes and gradients in the schedule.", SSW + "3.2, 4.4", S.ssw],
    ["s-line", "sewer", "Sanitary", "verified", "Drain-lines and inspection chambers", "A drain-line is at least 150 mm and at most 50 m long. An inspection chamber goes at every bend, junction and change, and the last one sits within 2.5 m of the boundary. A chamber is at least 750 mm deep. A WC pipe is 100 mm at a gradient of at least 1 in 50.", "Drain-line sizes, lengths and gradients; inspection chamber positions.", SSW + "4.2.1, Table 6", S.ssw],
    ["s-grease", "sewer", "Sanitary", "verified", "Grease traps for food outlets", "Every food shop and food processing establishment has a grease trap, on a system separate from the toilets. Food-shop drain-lines are at least 250 mm.", "Grease trap position and the separate kitchen drain-line.", SSW + "4.2.2, 4.6.1", S.ssw],
    ["s-base", "sewer", "Sanitary", "verified", "Basement sewage is pumped up", "Sewage collected in a basement is pumped by an ejector to an inspection chamber at ground level. The ejector has a vent pipe and a sump pump in its pit.", "Ejector room, rising main and the ground-level chamber it discharges to.", SSW + "1.2.1(c), 4.4(d)", S.ssw],
    ["s-rain", "sewer", "Sanitary", "verified", "No rainwater into the sewer", "Open yards, courtyards, open-sided areas, multi-storey car parks and swimming-pool balancing tanks must not drain to the sewer.", "Where each open area drains to.", SSW + "4.1(f)", S.ssw],
    ["s-trap", "sewer", "Sanitary", "verified", "Trap seals and vents", "A floor trap has a water seal of at least 50 mm, a urinal or bidet trap at least 75 mm, and a ventilating stack is at least 75 mm.", "Trap and vent sizes in the sanitary schedule.", SSW + "4.3", S.ssw],
    ["s-te", "sewer", "Trade effluent", "verified", "Trade effluent needs written approval", "An operator must apply to PUB before discharging any trade effluent to the sewer. Industrial premises need a sampling sump. Effluent may not be diluted to meet the limits. The numeric limits were not read for this hub.", "Sampling sump and any neutralisation system on the plan.", SSW + "5.1, 5.2", S.ssw],
    ["s-test", "sewer", "Testing", "verified", "Testing before commissioning", "Sewers under 900 mm and drain-lines are water tested for 30 minutes. Every new sewer, manhole and pumping main is inspected by CCTV before commissioning and again before the defects liability period ends.", "Test and CCTV requirements in the notes.", SSW + "3.4.3, Annex D", S.ssw],
    /* water pipes */
    ["w-cover", "water", "Water pipes", "verified", "Cover and structures over a water pipe", "A PUB water pipe keeps at least 1 m of cover. No structure may be built over it, and other services pass under it. The setback table by diameter was not read cleanly, so check PUB's advisory.", "Water pipe alignment, cover and anything above it.", "PUB advisory, Prevention of damage to water pipes, Jan 2025", S.wpa],
    ["w-notify", "water", "Water pipes", "verified", "Works near a water pipe", "For a pipe under 300 mm, notify PUB. For a pipe of 300 mm or more, submit and get PUB's approval before any work. Buy the Water Services Plan, find the pipe by manual trial holes and peg its alignment.", "Water pipes shown from the Water Services Plan, with trial hole positions.", "PUB advisory, Prevention of damage to water pipes, Jan 2025", S.wpa]
  ].map(function (r) { return { id: "pub-r-" + r[0], kind: "rule", scope: r[1], agency: "PUB", topic: r[2], status: r[3], title: r[4], body: r[5], evidence: r[6], ref: r[7], src: r[8] }; });

  var process = [
    ["qp", "Who may submit", "The qualified person is an architect or a PE. Peak runoff calculations are endorsed by a PE (Civil). Works in a public sewer corridor are submitted by a PE (Civil or Geotechnical). Sanitary works are notified by a licensed plumber.", "Codes of Practice on Surface Water Drainage and on Sewerage and Sanitary Works", S.swd, "verified"],
    ["seq", "The four clearances", "Development control clearance, then detailed plan clearance for each scope, then clearance for TOP, then clearance for CSC. PUB issues its TOP or CSC clearance when the last compliance certificate is in.", "PUB, Submission process", S.flow, "verified"],
    ["time", "PUB's response times", "PUB's service commitment is 14 working days each for development control, detailed plans, TOP or CSC clearance, POWS and ECM approval. A water works notification takes 12 working days from a licensed plumber or 21 from a PE.", "PUB, Service commitment", S.svc, "verified"],
    ["fee", "PUB charges for submissions", "From 1 April 2025 the QP making the first building plan application must pay PUB's fee before it is processed, and each waiver or deviation is charged. The amounts were not retrieved for this hub.", "PUB, Application fees", S.fee, "unverified"],
    ["top", "Declaration and survey for TOP", "The QP declares that platform levels, crest levels and peak runoff comply, supported by an as-constructed survey by a registered surveyor.", SWD + "cl 11.1", S.swd, "verified"],
    ["csc", "Certificate of inspection for CSC", "The QP certifies the drainage works and gives PUB the as-constructed drawings. The defects liability period is one year from PUB's no-objection to the CSC.", SWD + "cl 12", S.swd, "verified"],
    ["floodduty", "Flood protection after handover", "Where flood barriers were approved, the owner or management corporation makes a declaration every year, with an inspection certificate endorsed by a PE for an automated barrier.", SWD + "cl 13.2", S.swd, "verified"],
    ["pen-silt", "Penalties for silty discharge", "A breach of the discharge limit carries up to S$5,000 under the Regulations. PUB says offenders can be fined up to S$50,000 and may face stop-work orders. Amendments passed in November 2024 raise the maximum for a repeat offence to S$100,000; when they took effect was not confirmed.", "Sewerage and Drainage Act 1999; PUB press release, 8 Nov 2024", S.ecmpr, "unverified"],
    ["pen-sewer", "Penalties for damaging a sewer or drain", "Under the November 2024 amendments, damaging the public sewerage system or carrying out works affecting a sewer without approval carries up to S$50,000 for a first offence and S$100,000 for a repeat. Damage to large sewers carries far more. When the amendments took effect was not confirmed.", "Sewerage and Drainage (Amendment) Bill, second reading, 11 Nov 2024", S.bill, "unverified"],
    ["pen-water", "Penalties for damaging a water pipe", "Damaging a PUB water pipe carries up to S$40,000, 3 months' jail, or both. For a pipe of 300 mm or more it is up to S$200,000, 3 years' jail, or both.", "Public Utilities Act 2001 s 47A, per PUB's advisory", S.wpa, "unverified"],
    ["wemp", "Water efficiency management plan", "A site that used 60,000 m³ or more of water in the previous year must install private meters, appoint a water efficiency manager and submit a plan each year.", "PUB, Mandatory water efficiency requirements", S.wemp, "verified"]
  ].map(function (r) { return { id: "pub-" + r[0], kind: "rule", scope: "sub", agency: "PUB", topic: "Process", status: r[5], checkable: false, title: r[1], body: r[2], ref: r[3], src: r[4] }; });

  var terms = [
    ["t-mpl", "Minimum platform level (MPL)", "The lowest level PUB allows for the ground of a development, set to keep it above flood water.", SWD + "cl 2.1", S.swd],
    ["t-crest", "Crest level", "The high point every route into a basement must rise over, so flood water cannot run down into it.", SWD + "cl 2.2", S.swd],
    ["t-shd", "Singapore Height Datum (SHD)", "The national zero level for heights. Platform and crest levels are given in metres above it.", SWD, S.swd],
    ["t-qecp", "Qualified Erosion Control Professional (QECP)", "A practising PE who has completed the specialised erosion and sediment control course and may design and endorse an ECM plan.", SWD + "terminology", S.swd],
    ["t-sids", "Silt Imagery Detection System (SIDS)", "PUB's system that watches site discharge points by CCTV and raises an alert when the water turns silty.", "PUB press release, 8 Nov 2024", S.ecmpr],
    ["t-pows", "POWS", "PUB's portal for submitting works near sewers and water pipes for approval.", SSW + "2.1", S.ssw],
    ["t-sip", "Sewerage Information Plan (SIP)", "PUB's plan of the public sewers around a site, obtained before design starts.", SSW + "1.1", S.ssw],
    ["t-dtss", "Deep Tunnel Sewerage System (DTSS)", "The deep trunk sewers that carry used water to the reclamation plants. They carry the widest setback and corridor.", SSW + "Table 1, Table 2", S.ssw],
    ["t-ic", "Inspection chamber (IC)", "An access chamber on a private drain-line, needed at every bend, junction and change.", SSW + "4.2.1", S.ssw]
  ].map(function (t) { return { id: "pub-" + t[0], kind: "term", agency: "PUB", status: "verified", title: t[1], body: t[2], ref: t[3], src: t[4] }; });

  function opt(id, label, qp, verdict, vlabel, basis, detail, ref, src, tags) { return { id: id, label: label, qp: qp, verdict: verdict, vlabel: vlabel, confidence: "High", basis: basis, detail: detail, ref: ref, src: src, tags: tags }; }

  window.PUBDATA = {
    meta: { asOf: "17 Nov 2026", setName: "PUB drainage, sewerage and water submission", note: "Internal reference for CVC Engineers. It summarises published rules and is not legal advice or an authority decision; the qualified person remains responsible for every submission." },
    synonyms: { mpl: ["minimum platform level", "platform level"], ecm: ["earth control measures", "silt"], qecp: ["qualified erosion control professional"], tss: ["total suspended solids"], ic: ["inspection chamber"], dtss: ["deep tunnel sewerage system"], dc: ["development control"], sip: ["sewerage information plan"], wemp: ["water efficiency management plan"], qp: ["qualified person"] },
    who: {
      buckets: [["pe", "Notify", "By a licensed plumber or the owner"], ["either", "PUB clearance", "Submitted by the qualified person"], ["architect", "Approval with a specialist", "PE (Civil), QECP or a POWS submission"]],
      headlineHtml: '<div class="note bad"><b>Find out what is in the ground before anything is designed or dug.</b> Sewers, the deep tunnel and water mains each carry a setback and a corridor, and damaging one is a criminal offence with fines up to S$200,000.</div><div class="panel"><h3>Four submissions, one agency</h3><div class="prose"><ul><li><b>Drainage:</b> platform and crest levels, drains, and peak runoff control from 0.2 hectares.</li><li><b>Earth control measures:</b> a plan by a QECP, approved before earthworks, to keep silt out of the drains.</li><li><b>Sewerage and sanitary:</b> connection to the public sewer, the sanitary layout, and protection of nearby sewers.</li><li><b>Water:</b> the water service installation, and protection of water pipes during works.</li></ul></div></div>',
      notesHtml: '<h3>Who signs what</h3><ul><li><b>Qualified person:</b> an architect or PE submits the drainage and sewerage plans.</li><li><b>PE (Civil):</b> endorses peak runoff calculations and hydraulic models.</li><li><b>QECP:</b> designs and endorses the earth control plan, and audits it at every stage of earthworks.</li><li><b>PE (Civil or Geotechnical):</b> submits works inside a public sewer corridor.</li><li><b>Licensed plumber:</b> notifies sanitary works and water service installations.</li></ul>',
      options: [
        opt("drain", "Any new building or reconstruction", "Architect or PE", "either", "DC, then detailed plans", "Platform and crest levels, the internal drainage and the connection are cleared at development control and then at detailed plan stage.", "14 working days at each stage.", SWD + "cl 2, 4", S.flow, "house factory condominium"),
        opt("peak", "Site of 0.2 ha or more", "PE (Civil) endorses the calculation", "architect", "Peak runoff control", "Runoff is held to a coefficient of 0.55 for a 10-year storm, usually with a detention tank.", "A&A counts where the affected area is 0.2 ha or more.", SWD + "cl 7.1.5", S.swd, "detention tank abc waters"),
        opt("ecm", "Any site with earthworks", "QECP", "architect", "ECM plan approval", "The contractor obtains PUB's approval and puts the measures in place before earthworks start.", "Sites of 0.2 ha and above also need CCTV linked to PUB's silt detection system.", SWD + "cl 6.3", S.ecm, "excavation silt construction"),
        opt("below", "Platform level that cannot be met", "Architect or PE; PE for flood barrier design", "architect", "PUB approval", "A lower platform needs PUB's approval, a floor of 3.5 m or 4.0 m SHD, and flood protection at every opening.", "The owner then declares the barriers' condition every year.", SWD + "cl 2.1.2, 2.4", S.swd, "flood barrier a&a"),
        opt("conn", "Connection to the public sewer", "Architect or PE", "either", "Sewerage plans and Form B", "Every development connects to a public sewer at a point PUB approves. The Sewerage Information Plan comes first.", "14 working days.", SSW + "1.1", S.ssw, "sewer manhole"),
        opt("san", "Sanitary works inside the building", "Licensed plumber", "pe", "Notification", "Sanitary works are notified by a licensed plumber.", "14 working days.", "PUB, Service commitment", S.svc, "toilet pipes"),
        opt("near", "Excavation, piling or a structure near a sewer", "PE (Civil or Geotechnical)", "architect", "POWS approval", "Inside the public sewer corridor of 10, 20 or 40 m, excavation deeper than 0.5 m, piling and any structure need an approved plan.", "A site office or a container inside the corridor counts.", SSW + "2.1, Table 2", S.ssw, "piling erss corridor"),
        opt("main", "Works near a water pipe of 300 mm or more", "PE appointed by the contractor", "architect", "PUB approval", "Approval is needed before any work, with trial holes to find the pipe.", "For a smaller pipe, notify PUB.", "PUB advisory on water pipes, Jan 2025", S.wpa, "water main excavation"),
        opt("food", "Food shop or food processing", "Architect or PE", "either", "Grease trap", "Every food shop has a grease trap on a system separate from the toilets.", "Drain-lines at least 250 mm.", SSW + "4.2.2", S.ssw, "restaurant kitchen canteen"),
        opt("te", "Industrial process water", "Operator applies; QP designs the sampling sump", "either", "Written approval", "No trade effluent may be discharged before PUB approves it in writing.", "No dilution to meet the limits.", SSW + "5.1", S.ssw, "factory effluent"),
        opt("water", "Water service installation", "Licensed plumber or PE", "pe", "Notification", "The installation is notified to PUB before work.", "12 working days from a licensed plumber, 21 from a PE.", "PUB, Service commitment", S.svc, "water supply meter")
      ]
    },
    lanes: ["Project team", "PUB"],
    tracks: [{ id: "bld", label: "New building" }, { id: "earth", label: "Earthworks, 0.2 ha or more" }, { id: "near", label: "Works near a sewer or water pipe" }, { id: "food", label: "Food outlet or industry" }],
    steps: [
      { id: "w-find", col: 0, lanes: [0, 0], untimed: true, title: "Find what is in the ground", tracks: ["bld", "earth", "near", "food"], agency: "Developer", lead: "QP", status: "verified",
        what: ["Sewerage Information Plan and Water Services Plan.", "Drainage reserve lines and the adjacent road levels.", "Trial holes to find pipes by hand."], out: ["Sewers, water pipes and drains plotted on the site plan, with their setbacks and corridors."],
        hurdles: ["Designing foundations before the sewer setback is known.", "Trusting the plan without trial holes. The main at Dunearn Road was on the plan."], ask: ["Is any sewer 900 mm or larger, or the deep tunnel, within 40 m?", "Is any water pipe 300 mm or larger nearby?"], ref: SSW + "1.1; PUB advisory on water pipes", src: S.ssw },
      { id: "w-dc", col: 1, lanes: [2, 2], tatMin: 14, tatMax: 14, tatNote: "14 working days", title: "Development control clearance", tracks: ["bld", "earth", "food"], agency: "PUB", lead: "QP", status: "verified",
        what: ["Platform and crest levels.", "Drainage and sewerage concept, and the connection points.", "PUB's fee, payable with the first application since 1 April 2025."], out: ["No objection for drainage and for sewerage and sanitary works."],
        hurdles: ["A platform level set from the wrong road level.", "Flood barriers proposed without clearance from the other agencies."], ask: ["What type of development is it for the platform level rule?", "Is the site 0.2 ha or more?"], ref: "PUB, Submission process", src: S.flow },
      { id: "w-pows", col: 1, lanes: [2, 2], tatMin: 14, tatMax: 14, tatNote: "14 working days", title: "POWS approval", tracks: ["near"], agency: "PUB", lead: "PE (Civil or Geotechnical)", status: "verified",
        what: ["Impact assessment against the limits for vibration, cracking and stress.", "Monitoring plan and a CCTV survey of the sewer before the works."], out: ["An approved plan. No work starts without it."],
        hurdles: ["Starting sheet piling or earth retaining works first.", "Percussion or displacement piles inside a large sewer's setback."], ask: ["Which works fall inside the corridor?"], ref: SSW + "2.1, 2.2", src: S.ssw },
      { id: "w-ecm", col: 2, lanes: [2, 2], tatMin: 14, tatMax: 14, tatNote: "14 working days for a QECP's application", title: "ECM plan approval", tracks: ["bld", "earth"], agency: "PUB", lead: "QECP", status: "verified",
        what: ["Perimeter cut-off drain, silt fence, silt traps, holding pond and treatment plant.", "Design for a 5-year storm.", "CCTV at the discharge points for sites of 0.2 ha and above."], out: ["Approval. The measures go in before earthworks."],
        hurdles: ["Earthworks started before the measures are in place.", "Silt traps of granite chips or sand, which are not accepted."], ask: ["Who is the QECP, and when are earthworks due to start?"], ref: SWD + "cl 6.3", src: S.ecm },
      { id: "w-dp", col: 3, lanes: [2, 2], tatMin: 14, tatMax: 14, tatNote: "14 working days", title: "Detailed plan clearance", tracks: ["bld", "earth", "food"], agency: "PUB", lead: "QP", status: "verified",
        what: ["Drainage plans with the peak runoff calculation endorsed by a PE (Civil).", "Sewer, sanitary and used water pumping plans.", "Flood barrier details and operating procedure where used."], out: ["Clearance for each scope."],
        hurdles: ["Detention tank combined with the basement pumps.", "Rainwater from an open yard drained to the sewer."], ask: ["Are the grease trap and the kitchen drain-line separate from the toilets?"], ref: "PUB, Submission process", src: S.flow },
      { id: "w-build", col: 4, lanes: [0, 0], untimed: true, title: "Build, inspect and monitor", tracks: ["bld", "earth", "near", "food"], agency: "Developer", lead: "Builder, QECP and QP", status: "verified",
        what: ["Earth control measures inspected after every rain and audited by the QECP.", "Monitoring at sewers and water pipes kept within the limits.", "Prompt response to silt alerts."], out: ["A site that discharges below 50 mg/L and damages nothing."],
        hurdles: ["Repeat silt offences, which go to court.", "A pump or temporary works added without telling the QECP."], ask: ["When was the last QECP audit?"], ref: SWD + "cl 6.3.8", src: S.swd },
      { id: "w-test", col: 5, lanes: [0, 0], untimed: true, title: "Test and survey", tracks: ["bld", "food"], agency: "Developer", lead: "QP", status: "verified",
        what: ["Water test of sewers and drain-lines.", "CCTV of new sewers and manholes.", "As-constructed survey of platform and crest levels by a registered surveyor."], out: ["Records to support the declarations."],
        hurdles: ["A crest built lower than drawn, found at the survey."], ask: ["Has the surveyor measured every basement opening?"], ref: SSW + "3.4.3; " + SWD + "cl 11.1", src: S.ssw },
      { id: "w-top", col: 6, lanes: [2, 2], tatMin: 14, tatMax: 14, tatNote: "14 working days", title: "Clearance for TOP", tracks: ["bld", "food"], agency: "PUB", lead: "QP", status: "verified",
        what: ["The QP's declaration on platform levels, crest levels and peak runoff.", "Completion of sewerage and sanitary works."], out: ["PUB's clearance for TOP."], hurdles: ["Detention tank or basement pumps not commissioned."], ask: ["Are all compliance certificates in?"], ref: SWD + "cl 11.1", src: S.flow },
      { id: "w-csc", col: 7, lanes: [2, 2], tatMin: 14, tatMax: 14, tatNote: "14 working days", title: "Clearance for CSC", tracks: ["bld", "food"], agency: "PUB", lead: "QP", status: "verified",
        what: ["Certificate of inspection for drainage works.", "As-constructed drawings and piling records."], out: ["PUB's clearance for CSC. A one-year defects liability period starts."], hurdles: ["A structure within 300 mm of a drainage reserve with no survey plan."], ask: ["Have the as-constructed drawings been submitted?"], ref: SWD + "cl 12", src: S.swd },
      { id: "w-after", col: 8, lanes: [0, 0], untimed: true, title: "After handover", tracks: ["bld", "food"], agency: "Owner", lead: "Owner", status: "verified",
        what: ["Annual declaration on flood barriers.", "Second CCTV of sewers before the defects period ends.", "A water efficiency plan each year where use is 60,000 m³ or more."], out: ["Systems that still work when the storm comes."], hurdles: ["Flood barriers never tested after handover."], ask: ["Does the owner know about the annual declaration?"], ref: SWD + "cl 13.2", src: S.swd }
    ],
    processNotesHtml: '<h3>How to read the times</h3><ul><li>The 14 working days at each stage is PUB\'s published service commitment for a submission that is in order.</li><li>The earth control plan is separate from the building plan stages and must be approved, and built, before earthworks.</li><li>A POWS approval near a sewer or a large water pipe is also separate, and it is the one most often skipped.</li></ul>',
    fees: {
      fields: [{ id: "dev", label: "Waivers or deviations applied for", type: "number", def: 0 }],
      items: [
        { id: "pub-fee", agency: "PUB", label: "Application fee", status: "unverified", ref: "PUB, Application fees for submission of building plan and water service works", src: S.fee,
          desc: "From 1 April 2025 PUB charges for the first building plan application, payable before it is processed. The fee table could not be retrieved for this hub, so no amount is shown. Do not tell a client PUB submissions are free.",
          calc: function () { return { amount: "Not confirmed", basis: "Look up PUB's fee table" }; } },
        { id: "pub-dev", agency: "PUB", label: "Waiver or deviation fee", status: "unverified", ref: "PUB, Application fees", src: S.fee, desc: "Charged for each deviation. The amount was not retrieved.",
          when: function (p) { return p.dev > 0; }, calc: function (p) { return { amount: "Not confirmed", basis: p.dev + " deviation(s), charged each" }; } }
      ],
      notesHtml: '<h3>What is not an authority fee</h3><ul><li>The QECP, the earth control measures and the silt treatment plant.</li><li>CCTV surveys of sewers, water tests and the registered surveyor.</li><li>Monitoring instruments near sewers and water pipes.</li></ul>'
    },
    facts: [
      { id: "name", label: "Project name or address", type: "text" },
      { id: "type", label: "Development type", type: "select", options: [["gen", "Landed house or other general development"], ["com", "Commercial, industrial, institutional or multi-unit residential"], ["sp", "Special facility, or linked to underground MRT"]], def: "gen" },
      { id: "coast", label: "Coast", type: "select", options: [["s", "Southern (4.0 m SHD)"], ["n", "Northern (4.5 m SHD)"]], def: "s" },
      { id: "road", label: "Adjacent road or ground level (m SHD)", type: "number" },
      { id: "plat", label: "Proposed platform level (m SHD)", type: "number" },
      { id: "crest", label: "Lowest basement crest level (m SHD), if any", type: "number" },
      { id: "site", label: "Site area (ha)", type: "number" },
      { id: "sewer", label: "Nearest public sewer diameter (mm)", type: "number" },
      { id: "dist", label: "Distance from works to that sewer (m)", type: "number" },
      { id: "food", label: "Food outlet on site", type: "select", options: [["n", "No"], ["y", "Yes"]], def: "n" }
    ],
    pathway: function (p) {
      var out = [], add = p.type === "sp" ? 1 : p.type === "com" ? 0.6 : 0.3, coast = p.coast === "n" ? 4.5 : 4.0, mpl = p.road ? Math.max(coast, p.road + add) : 0, cr = p.type === "gen" ? 0.15 : 0.3, f = function (x) { return x.toFixed(2); };
      if (mpl) {
        if (p.plat) out.push(p.plat >= mpl ? { level: "info", text: "Platform level " + f(p.plat) + " m meets the minimum of " + f(mpl) + " m SHD.", ref: "COP on Surface Water Drainage cl 2.1.1" } : { level: "bad", text: "Platform level " + f(p.plat) + " m is below the minimum of " + f(mpl) + " m SHD. Raise it, or apply to PUB with flood protection.", ref: "COP on Surface Water Drainage cl 2.1.1, 2.1.2" });
        else out.push({ level: "info", text: "Minimum platform level is " + f(mpl) + " m SHD: the higher of " + f(coast) + " m and " + (add * 1000) + " mm above the road.", ref: "COP on Surface Water Drainage cl 2.1.1" });
        if (p.crest) out.push(p.crest >= mpl + cr ? { level: "info", text: "Crest level " + f(p.crest) + " m meets the minimum of " + f(mpl + cr) + " m SHD.", ref: "COP on Surface Water Drainage cl 2.2" } : { level: "bad", text: "Crest level " + f(p.crest) + " m is below the minimum of " + f(mpl + cr) + " m SHD, which is " + (cr * 1000) + " mm above the platform level.", ref: "COP on Surface Water Drainage cl 2.2" });
      }
      if ((p.site || 0) >= 0.2) out.push({ level: "warn", text: "0.2 ha or more: peak runoff must be held to a coefficient of 0.55, endorsed by a PE (Civil), and the site needs CCTV linked to PUB's silt detection during earthworks.", ref: "COP on Surface Water Drainage cl 7.1.5, 6.3" });
      if (p.sewer && p.dist != null && p.dist !== "") { var cor = p.sewer >= 900 ? 20 : 10; if (p.dist <= cor) out.push({ level: "bad", text: "The works are within the " + cor + " m public sewer corridor. Excavation over 0.5 m, piling or any structure needs a POWS approval first.", ref: "COP on Sewerage and Sanitary Works 2.1" }); }
      if (p.food === "y") out.push({ level: "info", text: "Food outlet: a grease trap on a system separate from the toilets, with drain-lines of at least 250 mm.", ref: "COP on Sewerage and Sanitary Works 4.2.2" });
      if (!out.length) out.push({ level: "info", text: "Enter the adjacent road level to work out the minimum platform level.", ref: "" });
      return out;
    },
    scopes: [{ id: "all", label: "All PUB rule sets" }, { id: "drain", label: "Drainage and platform levels" }, { id: "ecm", label: "Earth control measures" }, { id: "sewer", label: "Sewerage and sanitary" }, { id: "water", label: "Water pipes" }],
    playbook: [
      { stage: "1. What is in the ground", ask: ["Sewerage Information Plan and Water Services Plan.", "Adjacent road levels and drainage reserve lines."], check: ["Sewer diameter and depth, for the setback.", "Whether the site falls in a sewer corridor."], chase: ["Trial holes before any foundation layout is fixed."] },
      { stage: "2. Levels", ask: ["Development type and which coast.", "Every route into the basement."], check: ["Platform level against the road level, not the kerb top.", "A crest at every ramp, stair, lift and vent."], chase: ["The architect's levels before they are frozen."] },
      { stage: "3. Runoff", ask: ["Site area and the affected area for A&A."], check: ["Weighted runoff coefficient and the 0.55 target.", "Detention tank empties in 4 hours and is separate from basement pumps."], chase: ["PE (Civil) endorsement of the calculation."] },
      { stage: "4. Earth control", ask: ["Who is the QECP?", "Earthworks start date."], check: ["Approval and installation both come before earthworks.", "CCTV at discharge points from 0.2 ha."], chase: ["The contractor's ECM plan in good time for 14 working days."] },
      { stage: "5. Sewerage and sanitary", ask: ["Connection point and the last inspection chamber."], check: ["Nothing over a sewer or manhole.", "Basement sewage pumped to ground level.", "No rainwater into the sewer."], chase: ["The licensed plumber's notification."] },
      { stage: "6. Construction", ask: ["Latest QECP audit and silt alerts."], check: ["Monitoring readings at sewers and pipes against the limits."], chase: ["Any change to pumps or temporary works, back to the QECP."] },
      { stage: "7. TOP and CSC", ask: ["As-constructed survey of platform and crest levels."], check: ["Water tests and CCTV done.", "Detention tank and pumps commissioned."], chase: ["The QP's declaration and the certificate of inspection."] }
    ],
    entries: terms.concat(rules, process)
  };

  window.PUBNUM = [
    ["300 mm", "", "Platform level above the adjacent road, general developments", "", "COP on Surface Water Drainage cl 2.1.1", "platform level"],
    ["600 mm", "", "The same, for commercial, industrial and multi-unit residential", "", "COP on Surface Water Drainage cl 2.1.1", "platform level"],
    ["150 mm", "", "Basement crest above the platform level; 300 mm for most other types", "", "COP on Surface Water Drainage cl 2.2", "crest level"],
    ["0.2 ha", "", "Site area that triggers peak runoff control and silt CCTV", "", "COP on Surface Water Drainage cl 7.1.5", "peak runoff"],
    ["0.55", "", "Runoff coefficient the site must be held to", "", "COP on Surface Water Drainage cl 7.1.5", "peak runoff"],
    ["4 hours", "", "For a detention tank to empty after a storm", "", "COP on Surface Water Drainage App 6", "detention tank"],
    ["50 mg/L", "", "Most silt allowed in water leaving a site", "", "Surface Water Drainage Regulations reg 4", "silt"],
    ["1.0 m/s", "", "Minimum velocity in a drain; 3.0 m/s maximum", "", "COP on Surface Water Drainage cl 7.3", "velocity"],
    ["1.0 m", "", "Least setback from a small, shallow public sewer", "", "COP on Sewerage and Sanitary Works Table 1", "sewer setback"],
    ["10 m", "", "Sewer corridor each side; 20 m from 900 mm, 40 m for the deep tunnel", "", "COP on Sewerage and Sanitary Works Table 2", "sewer corridor"],
    ["14", "", "Working days PUB gives itself at each stage", "", "PUB service commitment", "response times"],
    ["S$200,000", "", "Maximum fine for damaging a water pipe of 300 mm or more", "", "Public Utilities Act 2001 s 47A", "penalties"]
  ];

  window.PUBSTATS = {
    quotes: {
      hammurabi: { pic: "stamp", n: "23.6 ha", nl: "of Singapore still flood-prone in 2024, from about 3,200 ha in the 1970s", lead: "The drain has the right of way", text: "No structure shall be constructed within a drain or drainage reserve.", paraphrase: true, by: "Code of Practice on Surface Water Drainage, clause 5.1", src: S.swd },
      fire: { pic: "deepex", n: "226", nl: "contractors PUB acted against over silt in three years, about half of them repeat offenders", lead: "Silt is the offence builders repeat", text: "Silt traps relying primarily on hardcore, granite chips or sands for filtration are not acceptable.", paraphrase: true, by: "Code of Practice on Surface Water Drainage, clause 6.3.7; PUB, November 2024", src: S.ecmpr },
      thai: { pic: "crane", n: "S$56,500", nl: "fine after a piling rig punctured a 500 mm water main, 2020", lead: "The main was on the plan", text: "No work activities are to commence until clearance has been granted.", paraphrase: true, by: "PUB advisory on preventing damage to water pipes, January 2025", src: S.wpa },
      bca: { pic: "check", n: "14", nl: "working days PUB gives itself at each stage", lead: "The engineer's name is on the levels", text: "Qualified persons are required to declare that their platform levels, crest levels and maximum allowable peak runoff comply.", paraphrase: true, by: "Code of Practice on Surface Water Drainage, clause 11.1", src: S.swd }
    },
    tilesTitle: "Two networks under every site", tilesSub: "What PUB protects, and what it costs to damage it.",
    tiles: [
      { n: "3,600 km", label: "of public sewers, plus 48 km of deep tunnel", year: "2024", by: "Ministry of Sustainability and the Environment", src: S.bill },
      { n: "23.6 ha", label: "of flood-prone area left", year: "2024", by: "PUB via data.gov.sg", src: S.floodd },
      { n: "226", label: "contractors acted against for silty discharge in three years", year: "2024", by: "PUB", src: S.ecmpr },
      { n: "S$100,000", label: "maximum fine for a repeat silt or drain offence under the 2024 amendments", year: "2024", by: "Sewerage and Drainage (Amendment) Bill", src: S.bill },
      { n: "0.2 ha", label: "site area from which silt CCTV and peak runoff control apply", year: "current", by: "PUB", src: S.swd },
      { n: "60,000 m³", label: "yearly water use that triggers a water efficiency plan", year: "current", by: "PUB", src: S.wemp }
    ],
    seriesTitle: "The record", seriesSub: "Flood-prone area has fallen from about 3,200 hectares in the 1970s.",
    series: [{ title: "Flood-prone area, hectares", note: "About 3,200 ha in the 1970s.", pts: [["2022", 27], ["2023", 24.1], ["2024", 23.6]], by: "PUB via data.gov.sg", src: S.floodd }],
    timeline: [
      { year: "2018", event: "Code of Practice on Surface Water Drainage, 7th edition", law: "The current edition, since amended by three addenda.", by: "PUB", src: S.swd },
      { year: "2018", bad: true, event: "128 contractors fined over silt in eleven months", law: "One contractor, Welltech, had five convictions for the same offence within a year.", by: "News report", src: S.well },
      { year: "2020", bad: true, event: "Piling rig punctures a 500 mm water main at Dunearn Road", law: "Feng Ming Construction is fined S$56,500. Sheet piling had started without an approved plan.", by: "News report", src: S.feng },
      { year: "2024", event: "Penalties raised and silt CCTV required", law: "Amendments passed in November raise repeat-offence fines to S$100,000. Sites of 0.2 ha and above need CCTV linked to PUB.", by: "MSE; PUB", src: S.bill },
      { year: "2025", bad: true, event: "Water main damaged at Still Road South", law: "Pal-Link Construction is fined S$49,000 after lift-shaft works flooded part of Marine Parade.", by: "News report", src: S.pal },
      { year: "2025", event: "New sewerage code, new addendum and fees", law: "The Sewerage and Sanitary Works code reaches its 3rd edition in March. In April, Addendum 3 to the drainage code is issued and PUB starts charging for submissions.", by: "PUB", src: S.ssw },
      { year: "2025", bad: true, event: "Sinkhole at Tanjong Katong Road South", law: "The ground opens at a PUB sewer-connection shaft on 26 July.", by: "News report", src: S.sink },
      { year: "2026", bad: true, event: "Seven parties to be charged over the sinkhole", law: "They include two qualified persons and a resident engineer. These are charges, not findings.", by: "News report, 11 June 2026", src: S.sink }
    ],
    disasters: null, db: null, systems: null
  };

  window.PUBCASES = [
    { stage: "What is in the ground", tag: "2020 · Dunearn Road", img: "img/st-case5.jpg", title: "The water main was on the plan", when: "September 2019; convicted August 2020", where: "Dunearn Road",
      story: [["crane", "A contractor starts sheet piling without a plan approved by PUB."], ["deepex", "The piling rig punctures a 500 mm water main. Thirty-eight households lose water for about nine and a half hours."], ["money", "The contractor, fined S$40,000 for a similar offence in 2013, is fined S$56,500."]],
      big: [["S$56,500", "total fine"], ["500 mm", "water main"], ["38", "households without water"]],
      lesson: "The Water Services Plan showed the main. Buy the plan, dig trial holes by hand, and get PUB's approval before any piling near a pipe of 300 mm or more.", grade: "from a news report of PUB's statement", src: [["The Independent, 14 September 2020", S.feng]] },
    { stage: "Construction", tag: "2025 · Still Road South", img: "img/st-case6.jpg", title: "Lift-shaft works flood Marine Parade", when: "4 October 2024; fined 11 March 2025", where: "Still Road South",
      story: [["deepex", "Lift-shaft works go ahead inside a water pipe corridor, with temporary earth retaining structures installed."], ["nostamp", "No approval was sought from PUB beforehand."], ["money", "A 300 mm potable main about 1.8 m down is damaged, flooding the area. The contractor is fined S$49,000."]],
      big: [["S$49,000", "fine"], ["300 mm", "potable main"], ["1.8 m", "depth of the main"]],
      lesson: "Temporary works count. Earth retaining structures inside a pipe corridor need PUB's approval as much as the permanent works do.", grade: "from a secondary report of the conviction", src: [["Report of the conviction, March 2025", S.pal]] },
    { stage: "Earth control", tag: "2018 · Silty discharge", img: "img/st-case7.jpg", title: "Five convictions for the same offence", when: "2017 to 2018", where: "Construction sites, Singapore",
      story: [["deepex", "Silty water leaves a contractor's site twice, in November 2017 and January 2018."], ["gavel", "The contractor already has four convictions for the same offence in 2017."], ["money", "It is fined S$11,200. In the same eleven months 128 contractors are fined."]],
      big: [["S$11,200", "fine for two counts"], ["128", "contractors fined in eleven months"], ["50 mg/L", "the discharge limit"]],
      lesson: "Earth control fails on maintenance, not on design. The plan needs inspection after every rain, and a repeat breach goes to court.", grade: "from a repost of a news report", src: [["News report, December 2018", S.well]] },
    { stage: "Supervision", tag: "2025 · Tanjong Katong sinkhole", img: "img/case5.jpg", title: "A sinkhole, and seven parties to be charged", when: "26 July 2025; charges announced 11 June 2026", where: "Tanjong Katong Road South",
      story: [["collapse", "The road collapses into a sinkhole at a PUB sewer-connection shaft."], ["falsedoc", "The authorities allege departures from the approved plans, mandatory tests not done, no working CCTV and false supervisor declarations."], ["gavel", "Seven parties are to be charged, including two qualified persons and a resident engineer."]],
      big: [["7", "parties to be charged"], ["2", "qualified persons among them"], ["1", "resident engineer among them"]],
      lesson: "The qualified person and the site supervisor are personally exposed for works below ground. These are allegations that have not been tested in court.", grade: "charges announced; no outcome yet; from a news report", src: [["Mothership, 11 June 2026", S.sink]] },
    { stage: "What is in the ground", tag: "2019 · PIE", img: "img/case2.jpg", title: "Excavation without an approved plan", when: "2019", where: "Pan Island Expressway",
      story: [["deepex", "A company excavates beside the expressway."], ["nostamp", "There is no plan approved by PUB for the works."], ["money", "A 300 mm water main is damaged and the company is fined S$44,500."]],
      big: [["S$44,500", "fine"], ["300 mm", "water main"], ["S$200,000", "the maximum for a pipe this size"]],
      lesson: "A 300 mm pipe is the threshold: at that size the works need PUB's approval, not just a notification.", grade: "from a news report", src: [["The Online Citizen, 11 June 2019", S.mega]] }
  ];

  var BY = "Compiled from PUB's Codes of Practice, its advisories and reported enforcement. PUB does not publish a list of common reasons for rejection.";
  window.PUBMIST = [
    { id: "level", name: "Levels", by: BY, src: S.swd, items: [
      ["Platform set from the kerb", "It is measured against the adjacent road or ground level, and against 4.0 m or 4.5 m SHD.", "mismatch"],
      ["Using 300 mm for every building", "Commercial, industrial and multi-unit residential need 600 mm, and MRT-linked developments 1 m.", "draft"],
      ["A basement opening with no crest", "Every ramp, stair, lift and vent needs one, 150 or 300 mm above the platform level.", "check"],
      ["Critical M&E in the basement", "It belongs at the platform level or higher.", "extra"]] },
    { id: "runoff", name: "Runoff", by: BY, src: S.swd, items: [
      ["Missing the 0.2 ha trigger on A&A", "It applies where the affected area is 0.2 ha or more.", "mismatch"],
      ["Old runoff coefficients", "Addendum 3 replaced the table: 1.00, 0.90 and 0.45.", "draft"],
      ["Detention tank sharing the basement pumps", "The two systems may not be combined.", "nostamp"],
      ["No PE (Civil) endorsement", "The peak runoff calculation must carry it.", "falsedoc"]] },
    { id: "ecm", name: "Earth control", by: BY, src: S.ecm, items: [
      ["Earthworks before the measures", "Approval and installation both come first.", "clock"],
      ["Gravel silt traps", "Traps relying on hardcore, granite chips or sand are not accepted.", "nostamp"],
      ["No inspection after rain", "The measures are inspected during or after every rain event.", "check"],
      ["No CCTV at the discharge point", "Required from 0.2 ha, linked to PUB's detection system.", "mismatch"]] },
    { id: "sewer", name: "Sewers", by: BY, src: S.ssw, items: [
      ["Footing inside the setback", "The setback is measured from the outermost edge, footings and overhangs included.", "mismatch"],
      ["A site office in the corridor", "Any structure in the corridor, even a container, needs a POWS approval.", "extra"],
      ["Manhole inside the building", "Not allowed.", "nostamp"],
      ["Rainwater to the sewer", "Open yards and car park decks must not drain to it.", "mismatch"],
      ["Toilets and kitchen on one line", "A food shop's grease trap system is separate from the toilets.", "draft"]] },
    { id: "water", name: "Water pipes", by: BY, src: S.wpa, items: [
      ["No trial holes", "The plan shows roughly where the pipe is. Trial holes show exactly.", "deepex"],
      ["Notifying when approval is needed", "At 300 mm and above the works need PUB's approval first.", "nostamp"],
      ["Temporary works left out", "Sheet piles and earth retaining structures count as works.", "crane"],
      ["A service laid over the pipe", "Other services pass under a water pipe.", "mismatch"]] },
    { id: "done", name: "Completion", by: BY, src: S.swd, items: [
      ["Crest built lower than drawn", "The as-constructed survey will show it, at the worst time.", "mismatch"],
      ["No CCTV of the new sewer", "Needed before commissioning and again before the defects period ends.", "check"],
      ["Pumps not commissioned", "The detention tank and basement pumps hold up the TOP clearance.", "clock"],
      ["Flood barriers forgotten after handover", "The owner must declare their condition every year.", "clock"]] }
  ];

  window.PUBQUIZ = [
    ["Levels", "How far above the adjacent road must a landed house platform be, at least?", "300 mm", ["150 mm", "600 mm", "1 m"], "And never below 4.0 m or 4.5 m SHD.", "COP on Surface Water Drainage cl 2.1.1"],
    ["Levels", "And for a commercial or multi-unit residential development?", "600 mm", ["300 mm", "450 mm", "1 m"], "1 m where it links to underground MRT.", "COP on Surface Water Drainage cl 2.1.1"],
    ["Levels", "How far above the platform level is a basement crest for a general development?", "150 mm", ["75 mm", "300 mm", "600 mm"], "300 mm for other development types.", "COP on Surface Water Drainage cl 2.2"],
    ["Runoff", "From what site area must peak runoff be controlled?", "0.2 ha", ["0.1 ha", "0.5 ha", "1 ha"], "The same figure triggers silt CCTV.", "COP on Surface Water Drainage cl 7.1.5"],
    ["Runoff", "What runoff coefficient must the site be held to?", "0.55", ["0.45", "0.75", "0.90"], "For a 10-year storm.", "COP on Surface Water Drainage cl 7.1.5"],
    ["Runoff", "How soon must a detention tank empty after a storm?", "Within 4 hours", ["Within 1 hour", "Within 10 hours", "Within 24 hours"], "", "COP on Surface Water Drainage App 6"],
    ["Runoff", "What runoff coefficient applies to roads and paved areas?", "1.00", ["0.45", "0.80", "0.90"], "0.45 for vegetated areas.", "COP on Surface Water Drainage cl 7.1.2"],
    ["Earth control", "What is the limit on silt in water leaving a site?", "50 mg/L of total suspended solids", ["10 mg/L", "100 mg/L", "500 mg/L"], "", "Surface Water Drainage Regulations reg 4"],
    ["Earth control", "Who designs and endorses the ECM plan?", "A QECP", ["The site supervisor", "Any licensed builder", "The architect"], "A practising PE with the erosion control course.", "COP on Surface Water Drainage cl 6.3"],
    ["Earth control", "What storm are earth control measures designed for?", "A 5-year storm", ["A 1-year storm", "A 10-year storm", "A 50-year storm"], "", "COP on Surface Water Drainage cl 6.3.5"],
    ["Sewers", "What is the corridor each side of a public sewer under 900 mm?", "10 m", ["2 m", "5 m", "20 m"], "20 m from 900 mm and 40 m for the deep tunnel.", "COP on Sewerage and Sanitary Works Table 2"],
    ["Sewers", "What is the setback from a 300 mm sewer that is 4 m deep?", "1.5 m", ["1.0 m", "2.0 m", "3.0 m"], "1.0 m up to 3 m deep, 2.0 m beyond 5 m.", "COP on Sewerage and Sanitary Works Table 1"],
    ["Sewers", "How is basement sewage taken away?", "Pumped by an ejector to a chamber at ground level", ["By gravity to the nearest manhole", "To the basement sump pump", "To a septic tank"], "", "COP on Sewerage and Sanitary Works 4.4"],
    ["Sewers", "What is the smallest drain-line allowed?", "150 mm", ["100 mm", "200 mm", "250 mm"], "250 mm for a food shop.", "COP on Sewerage and Sanitary Works 4.2.1"],
    ["Water", "From what water pipe size do works need PUB's approval, not just notification?", "300 mm", ["100 mm", "150 mm", "900 mm"], "", "PUB advisory on water pipes"],
    ["Water", "What is the minimum cover over a PUB water pipe?", "1 m", ["0.5 m", "1.5 m", "2 m"], "", "PUB advisory on water pipes"],
    ["Process", "How long does PUB give itself at each clearance stage?", "14 working days", ["5 working days", "20 working days", "30 working days"], "", "PUB service commitment"],
    ["Process", "What supports the QP's declaration of levels for TOP?", "An as-constructed survey by a registered surveyor", ["The architect's drawings", "The builder's letter", "A site photograph"], "", "COP on Surface Water Drainage cl 11.1"]
  ];
})();
