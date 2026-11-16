/* SCDF fire safety submission data set. Same shape as the other sets so the one engine renders it.
   The Fire Code and shelter rules are the entries already held in the BP set (data.js, rules.js), regrouped here.
   Process, routes, fees, penalties and cases were researched 17 Nov 2026 from SCDF and MHA pages.
   The statute website could not be read, so section numbers and statute wording are marked unverified. */
(function () {
  "use strict";
  var BP = window.BPDATA || { entries: [] }, BS = window.BPSTATS || {}, BC = window.BPCASES || [];
  var F = "https://www.scdf.gov.sg/", ACT = "https://sso.agc.gov.sg/Act/FSA1993", REG = "https://sso.agc.gov.sg/SL/FSA1993-RG1?WholeDoc=1";
  var S = {
    plans: F + "fire-safety-services-listing/plans-submission-process", pc: "https://scdf.gov.sg/home/fire-safety/plans-and-consultations", approval: F + "fire-safety-services-listing/plans-submission-process/plan-approval",
    fsc: F + "fire-safety-services-listing/plans-submission-process/fire-safety-certificate-temporary-fire-permit", maa: "https://scdf.gov.sg/home/fire-safety/plans-and-consultations/minor-addition-alteration-works",
    waiver: F + "fire-safety-services-listing/plans-submission-process/waiver-application", pb: F + "fire-safety-services-listing/plans-submission-process/performance-based--approach-to-fire-safety--design/performance-based-plan-approval-process",
    ri: "https://scdf.gov.sg/home/fire-safety/permits-and-certifications/registered-inspector", fsm: F + "home/fire-safety/permits-and-certifications/fire-safety-manager-(fsm)", fc: "https://scdf.gov.sg/home/fire-safety/permits-and-certifications/fire-certificate",
    pen: "https://scdf.gov.sg/eventslisting/newsarticledetail/SCDF-Stepping-Up-Fire-Safety-Enforcement-Checks", cou: "https://scdf.gov.sg/eventslisting/newsarticledetail/scdf-reminds-property-owners-and-occupiers-to-seek-approval-for-the-change-of-use-of-any-premises",
    mha: "https://www.mha.gov.sg/media-room/newsroom/commencement-of-the-fire-safety-amendment-act/", toh: "https://scdf.gov.sg/eventslisting/newsarticledetail/SCDF-Takes-Immediate-Actions-to-Ensure-Fire-Safety-of-Buidlings",
    six: F + "eventslisting/newsarticledetail/scdf-charges-six-building-owners-for-occupying-premises-without-valid-fire-certificate", toa: "https://www.malaymail.com/news/singapore/2025/02/10/singapore-authorities-say-mezzanine-floor-in-collapsed-toa-payoh-warehouse-was-built-without-approval/166148",
    stats: F + "home/about-scdf/media-room/latest-happenings/newsarticledetail/emergency-medical-services--fire-and-enforcement-statistics-2025", circ: F + "firecode2023/circulars"
  };
  function up(a) { return Math.ceil(Math.max(0, a) / 100); }

  /* Fire Code and shelter rules, taken from the BP set and regrouped */
  function scopeOf(id) { var m = /^rule-FC-(\d+)/.exec(id); if (!m) return "shelter"; var n = +m[1]; return n <= 3 ? "basics" : n <= 26 ? "escape" : n <= 31 ? "comp" : n <= 40 ? "fight" : "sub"; }
  var code = BP.entries.filter(function (e) { return e.kind === "rule" && e.agency === "SCDF"; }).map(function (e) { var c = {}; Object.keys(e).forEach(function (k) { c[k] = e[k]; }); c.scope = scopeOf(e.id); return c; });

  var process = [
    ["approve", "Approval comes before the works", "A person who wants to carry out fire safety works must first get SCDF's approval of the plans. Fire safety works include installing, removing or altering any fire safety measure. Some works are exempt, and listed minor works need only a lodgment.", "Fire Safety Act 1993; SCDF, Plans submission process", S.plans, "unverified"],
    ["pen-start", "Penalty for starting without approved plans", "Starting fire safety works without plan approval carries a fine of up to S$200,000, up to 24 months' jail, or both.", "Fire Safety Act 1993; SCDF news release, 2015", S.pen, "unverified"],
    ["pen-cou", "Penalty for an unauthorised change of use", "From 14 September 2020 an unauthorised change of use carries a fine of up to S$200,000, up to 24 months' jail, or both, with up to S$1,000 a day for a continuing offence. SCDF may also order the premises closed.", "Fire Safety Act 1993 s 61(1); SCDF news release, 2022", S.cou, "unverified"],
    ["pen-gen", "Penalty for general fire safety breaches", "Breaches such as obstructed exits and unmaintained systems carry up to S$10,000, up to 6 months' jail, or both. Since 2020 SCDF can prosecute serious risks at once, without first issuing an abatement notice.", "SCDF news release, 2015; MHA, 2020", S.mha, "unverified"],
    ["qp", "Plans are prepared and signed by a qualified person", "Fire safety plans are prepared and submitted by a qualified person: a registered architect or a professional engineer of the discipline that matches the work. The QP signs the plans, calculations, report and application form.", "SCDF, Plans submission process", S.plans, "verified"],
    ["docs", "What goes in with the plans", "One set of plans, the application form, the plan fee, the QP's declaration, and calculations where they apply: occupant load, unprotected openings, pressurisation, smoke control and sprinkler hydraulics.", "SCDF, Plans submission process", S.plans, "verified"],
    ["maa", "Minor A&A lodgment", "Only works listed in the Schedule to regulation 4 may be lodged. A registered architect or a PE (civil, structural, mechanical or electrical) lodges before the works start, with the consent of the building owner or management corporation. The fee is S$90. The list of qualifying works was not read for this hub.", "Fire Safety (Building and Pipeline Fire Safety) Regulations, reg 4; SCDF, Minor A&A", S.maa, "unverified"],
    ["waiver", "Waivers go in before the plans", "A departure from the Fire Code needs a waiver, and every waiver application must be submitted before any formal plan submission. The fee is S$160 for each item. An appeal lies to the Minister for Home Affairs within 28 days.", "SCDF, Waiver application", S.waiver, "verified"],
    ["pb", "Performance-based design", "An alternative solution needs a fire safety engineer, who prepares the design brief, report, drawings and operations manual, and then a separate peer reviewer. A submission without the QP's, the engineer's and the peer reviewer's declarations is disapproved.", "SCDF, Performance-based plan approval process", S.pb, "verified"],
    ["ri-type", "Registered Inspectors", "The owner engages Registered Inspectors to inspect and certify the fire safety works before applying for a permit or certificate. An RI (Architectural) covers the building aspects and an RI (M&E) the mechanical and electrical aspects. An RI is an architect or PE with at least 10 years' experience.", "SCDF, Registered Inspector", S.ri, "verified"],
    ["ri-ind", "The Registered Inspector must be independent", "An RI may have no professional or financial interest in the project. Design or construction involvement before plan approval, ties to an interested company, or a spouse with an interest all disqualify.", "SCDF, Registered Inspector", S.ri, "verified"],
    ["ri-form", "Form 1 and Form 2", "On Form 1 the RI certifies that all fire safety works are fully complete, which leads to a Fire Safety Certificate. On Form 2 the RI certifies completion with minor deviations that do not make the building unsafe, and SCDF may then consider a Temporary Fire Permit for a limited period.", "SCDF, Registered Inspector", S.ri, "verified"],
    ["fsc-docs", "Documents for the Fire Safety Certificate", "The application form, certification for fire safety works, certification for lift installation, certification for the fire engine access road and accessway, the RI's certificates and report, the RI's letter of appointment, and the declaration of regulated fire safety products. There is no fee.", "SCDF, Fire Safety Certificate and Temporary Fire Permit", S.fsc, "verified"],
    ["fsm", "Fire Safety Manager", "A Fire Safety Manager is needed for a public building of 9 or more storeys, an occupant load of 1,000 or more, or a floor area of 5,000 m² or more; for industrial buildings and foreign-employee dormitories at the same load or area; and for every hospital. The owner must appoint one within 90 days of TOP or CSC.", "SCDF, Fire Safety Manager", S.fsm, "verified"],
    ["fc", "Fire Certificate", "Public buildings with an occupant load above 200, larger industrial buildings and dormitories, hospitals and some tall residential buildings need a Fire Certificate. It is valid for 12 months, or 36 months where validity starts on or after 1 April 2026. Apply within 12 months of TOP or CSC and renew at least 2 months before expiry.", "Fire Safety Act 1993 s 35; SCDF, Fire Certificate", S.fc, "verified"],
    ["code", "Fire Code 2023 and its amendments", "The Code of Practice for Fire Precautions in Buildings 2023 was published on 25 August 2023. Amendments come in batches by circular, and plans submitted on or after an amendment's effective date must follow it. The first batch took effect on 1 September 2024.", "SCDF, Fire Code 2023 circulars", S.circ, "verified"],
    ["cx", "CORENET X", "New projects of 5,000 m² GFA and above go through the CORENET X gateways from 1 October 2026. Unprotected-opening calculations are submitted at the Construction Gateway. SCDF's other gateway rules were not confirmed.", "CORENET X implementation circular and FAQ", "https://support.corenet.gov.sg/hc/en-us/articles/13750777465359", "unverified"]
  ].map(function (r) { return { id: "scdf-" + r[0], kind: "rule", scope: "sub", agency: "SCDF", topic: "Process", status: r[5], checkable: false, title: r[1], body: r[2], ref: r[3], src: r[4] }; });

  var terms = [
    ["t-fsw", "Fire safety works", "Fire protection works, and the installation, provision or removal of, or addition or alteration to, any fire safety measure.", "Fire Safety Act 1993", ACT, "unverified"],
    ["t-ri", "Registered Inspector (RI)", "An architect or PE with at least 10 years' experience, registered with SCDF, whom the owner engages to inspect and certify completed fire safety works. There are architectural and M&E inspectors.", "SCDF, Registered Inspector", S.ri, "verified"],
    ["t-fse", "Fire safety engineer (FSE)", "The specialist who designs an alternative, performance-based solution. A second engineer reviews it as peer reviewer.", "SCDF, Performance-based approach", S.pb, "verified"],
    ["t-fsc", "Fire Safety Certificate (FSC)", "SCDF's certificate that the fire safety works are complete. A building may not be used or occupied without it or a Temporary Fire Permit.", "SCDF, FSC and TFP", S.fsc, "verified"],
    ["t-tfp", "Temporary Fire Permit (TFP)", "A permit for a limited period, given only where the works are satisfactorily complete with very minor items outstanding.", "SCDF, FSC and TFP", S.fsc, "verified"],
    ["t-maa", "Minor A&A lodgment (MAA)", "Lodgment by a qualified person, in place of plan approval, for the minor works listed in the Schedule to regulation 4.", "SCDF, Minor A&A", S.maa, "verified"],
    ["t-fc", "Fire Certificate", "A recurring certificate for occupied buildings that their fire safety systems are maintained. Different from the Fire Safety Certificate given at completion.", "SCDF, Fire Certificate", S.fc, "verified"],
    ["t-fsm", "Fire Safety Manager (FSM)", "The person a larger building's owner must appoint to run its fire safety programme and report yearly to SCDF.", "SCDF, Fire Safety Manager", S.fsm, "verified"]
  ].map(function (t) { return { id: "scdf-" + t[0], kind: "term", agency: "SCDF", status: t[5], title: t[1], body: t[2], ref: t[3], src: t[4] }; });

  function opt(id, label, qp, verdict, vlabel, basis, detail, ref, src, tags, conf) { return { id: id, label: label, qp: qp, verdict: verdict, vlabel: vlabel, confidence: conf || "High", basis: basis, detail: detail, ref: ref, src: src, tags: tags }; }
  var toh = BC.filter(function (c) { return /Toh Guan/.test(c.tag || ""); })[0];
  function clone(o, extra) { var c = {}; Object.keys(o).forEach(function (k) { c[k] = o[k]; }); Object.keys(extra).forEach(function (k) { c[k] = extra[k]; }); return c; }

  window.SCDFDATA = {
    meta: { asOf: "17 Nov 2026", setName: "SCDF fire safety submission", note: "Internal reference for CVC Engineers. It summarises published rules and is not legal advice or an authority decision; the qualified person remains responsible for every submission." },
    synonyms: { fsc: ["fire safety certificate"], tfp: ["temporary fire permit"], maa: ["minor a&a", "minor addition and alteration"], ri: ["registered inspector"], fse: ["fire safety engineer"], fsm: ["fire safety manager"], qp: ["qualified person"], fc: ["fire certificate"], pb: ["performance-based"] },
    who: {
      buckets: [["pe", "Lodgment", "Minor works on the Schedule"], ["either", "Plan approval", "Design that follows the Fire Code"], ["architect", "Approval with extra steps", "Waiver or performance-based design"]],
      headlineHtml: '<div class="note bad"><b>No fire safety works before SCDF approves the plans, and no occupation before the certificate.</b> Starting early carries a fine of up to S$200,000, two years\' jail, or both.</div><div class="panel"><h3>Three routes in, one way out</h3><div class="prose"><ul><li><b>Minor A&A lodgment.</b> Works on the Schedule are lodged by a qualified person for S$90 and may start after lodgment.</li><li><b>Plan approval.</b> A design that follows the Fire Code is submitted by the qualified person with a declaration.</li><li><b>Waiver or performance-based design.</b> A departure from the Code needs a waiver before the plans go in, or a fire safety engineer and a peer reviewer.</li></ul><p>Every route ends the same way: a Registered Inspector certifies the finished works, and SCDF issues a Fire Safety Certificate or a Temporary Fire Permit.</p></div></div>',
      notesHtml: '<h3>Who signs what</h3><ul><li><b>Qualified person:</b> a registered architect, or a PE of the discipline matching the work, prepares and signs the plans. Fire protection and mechanical ventilation plans are by the M&E engineer.</li><li><b>Registered Inspector:</b> engaged by the owner, independent of the design and construction, certifies completion on Form 1 or Form 2.</li><li><b>Fire safety engineer and peer reviewer:</b> only for performance-based design.</li><li><b>Owner:</b> appoints the inspectors, and later the Fire Safety Manager within 90 days of TOP or CSC where one is required.</li></ul>',
      options: [
        opt("maa", "Minor works listed in the Schedule", "Architect or PE (civil, structural, mechanical or electrical)", "pe", "Lodgment", "Only works in the Schedule to regulation 4 may be lodged. Lodged before works start, with the owner's or management corporation's consent.", "Fee S$90. The list of qualifying works was not read for this hub, so check it on SCDF's page first.", "Fire Safety (Building and Pipeline Fire Safety) Regulations, reg 4", S.maa, "partition renovation shop office fit-out", "Medium"),
        opt("new", "New building", "Architect or PE", "either", "Plan approval", "Fire safety plans are submitted by the qualified person and approved before works start.", "S$160 per 100 m² with a prescribed fire safety measure such as sprinklers, a fire alarm, a fire lift or a rising main; S$100 without.", "SCDF, Plans submission process", S.plans, "erection"),
        opt("aa", "A&A or change of use outside the Schedule", "Architect or PE", "either", "Plan approval", "A&A to existing fire safety works and any change of use need plan approval.", "S$90 per storey where floor area is not increased. An unauthorised change of use carries up to S$200,000.", "SCDF, Plans and consultations", S.pc, "alteration mezzanine conversion"),
        opt("fp", "Fire protection or mechanical ventilation system", "M&E professional engineer", "either", "Plan approval", "Sprinkler, alarm, rising main, smoke control and mechanical ventilation plans are submitted by the M&E engineer.", "S$90 per storey.", "SCDF, Plans and consultations", S.pc, "sprinkler alarm ventilation"),
        opt("waiver", "Design that cannot meet a Fire Code clause", "Architect or PE; some clauses need a fire safety engineer's assessment", "architect", "Waiver first", "Every waiver application must be submitted before any formal plan submission.", "S$160 for each item. Appeal to the Minister within 28 days.", "SCDF, Waiver application", S.waiver, "modification deviation"),
        opt("pb", "Alternative, performance-based solution", "Fire safety engineer, plus a second as peer reviewer", "architect", "FSE and peer reviewer", "The fire safety engineer prepares the design brief and report; the peer reviewer then reports independently.", "Without all three declarations the submission is disapproved.", "SCDF, Performance-based plan approval process", S.pb, "atrium engineered timber"),
        opt("fsc", "Completed works, before anyone moves in", "Registered Inspectors engaged by the owner", "either", "RI, then FSC or TFP", "The RI inspects and certifies on Form 1 or Form 2, and the QP applies for the certificate or permit.", "No fee. SCDF may pick the application for its own inspection.", "SCDF, FSC and TFP", S.fsc, "completion top occupation")
      ]
    },
    tracks: [{ id: "new", label: "New building or A&A" }, { id: "maa", label: "Minor A&A" }, { id: "waiver", label: "With a waiver" }, { id: "pb", label: "Performance-based" }],
    steps: [
      { id: "f-scope", col: 0, lanes: [0, 0], untimed: true, title: "Work out the route", tracks: ["new", "maa", "waiver", "pb"], agency: "Owner", lead: "QP", status: "verified",
        what: ["Purpose group, habitable height, floor area and occupant load.", "Whether the works are on the minor A&A Schedule.", "Whether any Fire Code clause cannot be met."], out: ["One of four routes, chosen before design is fixed."],
        hurdles: ["Calling works minor when they are not on the Schedule.", "Finding out late that a clause cannot be met."], ask: ["What is the use and the habitable height?", "Does anything in the layout depart from the Fire Code?"], ref: "SCDF, Plans submission process", src: S.plans },
      { id: "f-qp", col: 1, lanes: [0, 0], untimed: true, title: "Appoint the qualified person", tracks: ["new", "maa", "waiver", "pb"], agency: "Owner", lead: "Owner", status: "verified",
        what: ["An architect or PE for the fire safety plans.", "An M&E engineer for fire protection and ventilation plans.", "A fire safety engineer and a peer reviewer for performance-based design."], out: ["Named signatories for every plan."],
        hurdles: ["Nobody appointed for the M&E fire protection plans."], ask: ["Who signs the building plans and who signs the M&E plans?"], ref: "SCDF, Plans submission process", src: S.plans },
      { id: "f-waiver", col: 2, lanes: [2, 2], untimed: true, title: "Waiver application", tracks: ["waiver"], agency: "SCDF", lead: "QP", status: "verified",
        what: ["Waiver form and the owner's authorisation letter.", "A fire safety engineer's assessment where the clause requires it."], out: ["SCDF's decision on each item."],
        hurdles: ["Submitting the waiver with, or after, the plans. It must come first.", "SCDF's processing time for waivers is not published."], ask: ["How many items, and is each one justified?"], ref: "SCDF, Waiver application", src: S.waiver },
      { id: "f-pb", col: 2, lanes: [2, 2], untimed: true, title: "Performance-based design and peer review", tracks: ["pb"], agency: "SCDF", lead: "Fire safety engineer", status: "verified",
        what: ["Design brief, then the engineer's report, drawings and operations manual.", "The peer reviewer's report."], out: ["A design SCDF can assess as an alternative solution."],
        hurdles: ["A missing declaration from the QP, the engineer or the peer reviewer.", "Using the route for issues SCDF's 2022 circular says it cannot address."], ask: ["Has the peer reviewer been engaged?"], ref: "SCDF, Performance-based plan approval process", src: S.pb },
      { id: "f-maa", col: 3, lanes: [2, 2], untimed: true, title: "Minor A&A lodgment", tracks: ["maa"], agency: "SCDF", lead: "QP", status: "verified",
        what: ["Site plan, whole-floor plan with exits, detailed layout, section and partition details.", "Owner's or management corporation's consent."], out: ["Acknowledgement of the lodgment. Works may then proceed."],
        hurdles: ["No owner's consent.", "Works outside the Schedule."], ask: ["Is there an existing FSC or TFP for the premises?"], ref: "SCDF, Minor A&A", src: S.maa },
      { id: "f-plan", col: 3, lanes: [2, 2], tatMin: 5, tatMax: 5, tatNote: "5 working days when in order, per SCDF's service pledge", title: "Fire safety plan approval", tracks: ["new", "waiver", "pb"], agency: "SCDF", lead: "QP", status: "verified",
        what: ["Plans, application form, plan fee and the QP's declaration.", "Calculations: occupant load, unprotected openings, pressurisation, smoke control, sprinkler hydraulics."], out: ["Plan approval. Fire safety works may then start."],
        hurdles: ["Travel distance and occupant load schedules missing.", "A plan submitted after an amendment's effective date but drawn to the old clause."], ask: ["Which Fire Code amendment batch applies on the submission date?"], ref: "SCDF service pledge; SCDF, Plan approval", src: S.approval },
      { id: "f-build", col: 4, lanes: [0, 0], untimed: true, title: "Build to the approved plans", tracks: ["new", "maa", "waiver", "pb"], agency: "Owner", lead: "QP and builder", status: "verified",
        what: ["Works supervised against the approved plans.", "Regulated fire safety products with valid certificates."], out: ["Completed works that match the plans."],
        hurdles: ["A product whose certificate has lapsed or been cancelled. This was the Toh Guan Road cladding.", "A mezzanine or partition added on site without approval."], ask: ["Is there a certificate for every regulated product delivered?"], ref: "SCDF, FSC and TFP", src: S.fsc },
      { id: "f-ri", col: 5, lanes: [0, 0], untimed: true, title: "Registered Inspector inspection", tracks: ["new", "waiver", "pb"], agency: "Owner", lead: "Registered Inspectors", status: "verified",
        what: ["RI (Architectural) and RI (M&E) inspect the completed works.", "Form 1 for full completion, Form 2 for minor deviations."], out: ["The RI's certificate and report."],
        hurdles: ["An inspector with an interest in the project.", "Works not actually complete on the inspection day."], ask: ["Are the RI appointment letters signed by the owner?"], ref: "SCDF, Registered Inspector", src: S.ri },
      { id: "f-fsc", col: 6, lanes: [2, 2], tatMin: 3, tatMax: 7, tatNote: "SCDF's page says 3 working days; its service pledge says 7", title: "Fire Safety Certificate or Temporary Fire Permit", tracks: ["new", "waiver", "pb"], agency: "SCDF", lead: "QP applies for the owner", status: "verified",
        what: ["Application form, the certifications, the RI's certificates and report, and the declaration of regulated fire safety products."], out: ["A Fire Safety Certificate, or a Temporary Fire Permit for a limited period where only very minor items remain."],
        hurdles: ["Using or occupying the building before the certificate.", "SCDF selects the application for its own inspection, normally within 10 days."], ask: ["Is anything still outstanding that would make it a permit and not a certificate?"], ref: "SCDF, FSC and TFP", src: S.fsc },
      { id: "f-fsm", col: 7, lanes: [0, 0], untimed: true, title: "Fire Safety Manager", tracks: ["new", "pb"], agency: "Owner", lead: "Owner", status: "verified",
        what: ["Appointed within 90 days of TOP or CSC where the building needs one."], out: ["A named manager on SCDF's eFSM portal."], hurdles: ["Not appointing one: up to S$10,000, 6 months' jail, or both."], ask: ["Is the building 9 storeys or more, 1,000 people or more, or 5,000 m² or more?"],
        ref: "SCDF, Fire Safety Manager", src: S.fsm },
      { id: "f-fc", col: 8, lanes: [2, 2], tatMin: 3, tatMax: 3, tatNote: "outcome within 3 business days", title: "Fire Certificate", tracks: ["new", "pb"], agency: "SCDF", lead: "Owner, with a PE", status: "verified",
        what: ["A PE and a contractor inspect and test the fire safety systems.", "Apply within 12 months of TOP or CSC, then renew at least 2 months before expiry."], out: ["A certificate valid for 12 months, or 36 months where validity starts on or after 1 April 2026."],
        hurdles: ["Letting it lapse. Six owners were charged in 2021."], ask: ["When does the current certificate expire?"], ref: "SCDF, Fire Certificate", src: S.fc }
    ],
    processNotesHtml: '<h3>How to read the times</h3><ul><li>The 5 working days for plan approval is SCDF\'s service pledge for a submission that is in order. SCDF publishes no time for waivers.</li><li>For the certificate, SCDF\'s page says it aims to respond within 3 working days and its service pledge says 7. Plan on 7, and longer if SCDF selects the application for inspection.</li><li>A minor A&A lodgment has no approval wait. The risk sits with the qualified person\'s declaration that the works are on the Schedule.</li></ul>',
    fees: {
      fields: [
        { id: "type", label: "Submission", type: "select", options: [["new_y", "New works with a prescribed fire safety measure"], ["new_n", "New works without one"], ["aa", "A&A or change of use, no added floor area"], ["fp", "Fire protection or mechanical ventilation plans"], ["maa", "Minor A&A lodgment"]], def: "new_y" },
        { id: "area", label: "Floor area of new works (m²)", type: "number", def: 2000 },
        { id: "storeys", label: "Storeys affected", type: "number", def: 1 },
        { id: "sw", label: "Waiver items", type: "number", def: 0 },
        { id: "fcst", label: "Storeys, for the Fire Certificate (0 if not needed)", type: "number", def: 0 },
        { id: "fcres", label: "Fire Certificate for", type: "select", options: [["n", "Non-residential building"], ["r", "Residential building"]], def: "n" }
      ],
      items: [
        { id: "scdf-plan", agency: "SCDF", label: "Fire safety plan fee", status: "verified", ref: "SCDF, Plans and consultations; Fire Safety (Building and Pipeline Fire Safety) Regulations", src: S.pc,
          desc: "New works: $160 for each 100 m² or part of floor area where the plans contain a prescribed fire safety measure, such as sprinklers, a fire alarm, a fire lift or a rising main, and $100 where they do not. A&A or change of use with no added floor area, amendments, and fire protection or mechanical ventilation plans: $90 per storey. Minor A&A lodgment: $90. No fee for the Fire Safety Certificate or Temporary Fire Permit.",
          calc: function (p) {
            var a = p.area || 0, n = Math.max(1, p.storeys || 1);
            if (p.type === "maa") return { amount: 90, basis: "Minor A&A lodgment" };
            if (p.type === "aa" || p.type === "fp") return { amount: 90 * n, basis: n + " storey(s) x $90" };
            var r = p.type === "new_y" ? 160 : 100; return { amount: r * up(a), basis: up(a) + " x $" + r };
          } },
        { id: "scdf-waiver", agency: "SCDF", label: "Fire safety waiver", status: "verified", ref: "SCDF, Waiver application", src: S.waiver, desc: "$160 for each item the waiver application relates to.",
          when: function (p) { return p.sw > 0; }, calc: function (p) { return { amount: 160 * p.sw, basis: p.sw + " item(s) x $160" }; } },
        { id: "scdf-fc", agency: "SCDF", label: "Fire Certificate", status: "verified", ref: "SCDF, Fire Certificate", src: S.fc, desc: "$33 per storey for a non-residential building and $11 per storey for a residential one. The fee under the three-year certificate from 1 April 2026 was not confirmed.",
          when: function (p) { return p.fcst > 0; }, calc: function (p) { var r = p.fcres === "r" ? 11 : 33; return { amount: r * p.fcst, basis: p.fcst + " storey(s) x $" + r }; } }
      ],
      notesHtml: '<h3>What this estimate leaves out</h3><ul><li>The Registered Inspectors, the fire safety engineer and peer reviewer, and system testing are commercial costs.</li><li>A resubmission after disapproval is charged at a reduced rate only in limited cases, so allow for a second full fee.</li><li>The Fire Certificate fee shown is the published per-storey rate. The amount under the three-year certificate was not confirmed.</li></ul>'
    },
    facts: [
      { id: "name", label: "Project name or address", type: "text" },
      { id: "works", label: "Works", type: "select", options: [["new", "New building"], ["aa", "A&A or change of use"], ["maa", "Minor A&A"]], def: "new" },
      { id: "use", label: "Use", type: "select", options: [["office", "Office"], ["shop", "Shop or restaurant"], ["fact", "Factory or warehouse"], ["hotel", "Hotel, hostel or dormitory"], ["res", "Flats or condominium"], ["inst", "School or healthcare"]], def: "office" },
      { id: "spr", label: "Sprinklered", type: "select", options: [["", "Not known"], ["y", "Yes"], ["n", "No"]], def: "" },
      { id: "height", label: "Habitable height (m)", type: "number" },
      { id: "area", label: "Largest floor area (m²)", type: "number" },
      { id: "occ", label: "Occupant load of the building", type: "number" },
      { id: "exits", label: "Exit staircases per storey", type: "number" }
    ],
    pathway: function (p) {
      var out = [], h = p.height || 0, res = p.use === "res";
      if (p.works === "maa") out.push({ level: "info", text: "Minor A&A: lodgment for S$90 if every item is on the Schedule. Anything outside it needs plan approval.", ref: "SCDF, Minor A&A" });
      else out.push({ level: "warn", text: "Plan approval is needed before any fire safety works start. Starting early carries up to S$200,000.", ref: "SCDF, Plans submission process" });
      if (h > 60) out.push({ level: "bad", text: "Above 60 m: wet rising main. Above 24 m: fire lift" + (res ? "" : ", sprinklers on every storey and an evacuation lift") + ". Accessway 7 m wide.", ref: "Fire Code 2023, Cl. 6.2, 6.6" });
      else if (h > 24) out.push({ level: "warn", text: "Above 24 m: dry rising main, fire lift" + (res ? "" : ", sprinklers on every storey and an evacuation lift") + ", and compartments limited to 2,000 m².", ref: "Fire Code 2023, Cl. 6.2, 6.4, 6.6" });
      else if (h > 10) out.push({ level: "info", text: "Above 10 m: a dry rising main is needed.", ref: "Fire Code 2023, Cl. 6.2" });
      if (p.exits && p.exits < 2) out.push({ level: "warn", text: "At least two independent exit staircases are needed on each storey unless a single-exit provision applies.", ref: "Fire Code 2023, Cl. 2.2.11" });
      if ((p.occ || 0) >= 1000 || (p.area || 0) >= 5000) out.push({ level: "info", text: "An occupant load of 1,000 or more, or a floor area of 5,000 m² or more: a Fire Safety Manager is needed within 90 days of TOP or CSC.", ref: "SCDF, Fire Safety Manager" });
      if (!res && (p.occ || 0) > 200) out.push({ level: "info", text: "A public building with an occupant load above 200 needs a Fire Certificate after completion.", ref: "SCDF, Fire Certificate" });
      return out;
    },
    scopes: [{ id: "all", label: "All SCDF rule sets" }, { id: "basics", label: "Purpose group and height" }, { id: "escape", label: "Means of escape" }, { id: "comp", label: "Compartments and fire resistance" }, { id: "fight", label: "Firefighting access and systems" }, { id: "shelter", label: "Civil defence shelters" }, { id: "sub", label: "Submission" }],
    playbook: [
      { stage: "1. Route", ask: ["Use, habitable height, floor area and occupant load.", "Is anything outside the Fire Code?"], check: ["Minor works against the Schedule, item by item.", "Which amendment batch applies on the planned submission date."], chase: ["The existing FSC or TFP for A&A works.", "The owner's or management corporation's consent."] },
      { stage: "2. Appointments", ask: ["Who signs the building plans, and who signs the M&E plans?"], check: ["A fire safety engineer and a separate peer reviewer for any alternative solution.", "That the intended Registered Inspectors have had no part in the design."], chase: ["Appointment letters."] },
      { stage: "3. Waivers", ask: ["A list of every clause that cannot be met."], check: ["Each waiver goes in before the plans.", "S$160 for each item is budgeted."], chase: ["SCDF's reply, before fixing the layout."] },
      { stage: "4. Plan submission", ask: ["Occupant load and travel distance schedules.", "Unprotected opening, pressurisation and sprinkler calculations."], check: ["Two remote exits per storey and the dead ends.", "Fire engine accessway width, length and position."], chase: ["The M&E fire protection plans, which are a separate submission."] },
      { stage: "5. Construction", ask: ["Certificates for every regulated fire safety product."], check: ["That each certificate is current on the day of delivery.", "That nothing has been added on site, such as a mezzanine or partition."], chase: ["The builder's product submissions."] },
      { stage: "6. Inspection and certificate", ask: ["The inspection date and the list of outstanding items."], check: ["Form 1 or Form 2, and whether a permit is acceptable to the owner.", "Nobody occupies before the certificate."], chase: ["The Registered Inspectors' report.", "Lift and accessway certifications."] },
      { stage: "7. After handover", ask: ["Does the building need a Fire Safety Manager or a Fire Certificate?"], check: ["Manager appointed within 90 days.", "Fire Certificate applied for within 12 months."], chase: ["The owner, before the first deadline."] }
    ],
    entries: terms.concat(code, process)
  };

  window.SCDFNUM = [
    ["15 m", "", "One-way travel distance without sprinklers, for most uses", "", "Fire Code 2023, Table 2.2A", "travel distance"],
    ["2", "", "Independent exit staircases on every storey, as a rule", "", "Fire Code 2023, Cl. 2.2.11", "number of exits"],
    ["1,000 mm", "", "Minimum width of an exit staircase", "", "Fire Code 2023, Cl. 2.2.7", "minimum widths"],
    ["10 m", "", "Habitable height above which a rising main is needed", "", "Fire Code 2023, Cl. 6.2", "rising mains"],
    ["24 m", "", "Habitable height that triggers fire lifts and, for most uses, sprinklers", "", "Fire Code 2023, Cl. 6.4, 6.6", "habitable height"],
    ["60 m", "", "Above this the rising main must be wet", "", "Fire Code 2023, Cl. 6.2", "rising mains"],
    ["6 m", "", "Width of a fire engine accessway; 7 m above 50 m", "", "Fire Code 2023, Cl. 4.2.2", "accessway"],
    ["S$200,000", "", "Maximum fine for starting fire safety works without approval", "", "Fire Safety Act 1993", "penalty"],
    ["S$160", "", "Plan fee per 100 m² where there is a prescribed fire safety measure", "", "SCDF, Plans and consultations", "plan fee"],
    ["S$90", "", "Fee to lodge a minor A&A", "", "SCDF, Minor A&A", "minor a&a"],
    ["5,000 m²", "", "Floor area at which a Fire Safety Manager is needed", "", "SCDF, Fire Safety Manager", "fire safety manager"],
    ["36 months", "", "Fire Certificate validity from 1 April 2026", "", "SCDF, Fire Certificate", "fire certificate"]
  ];

  var q = BS.quotes || {};
  window.SCDFSTATS = {
    quotes: {
      hammurabi: { pic: "stamp", n: "S$200,000", nl: "maximum fine for starting fire safety works without approved plans", lead: "Approval first, then the works", text: "A person who wants to carry out fire safety works must first obtain approval of plans from the Singapore Civil Defence Force.", paraphrase: true, by: "SCDF, Plans submission process", src: S.plans },
      fire: q.fire || { pic: "fire", n: "2,050", nl: "fires in 2025", text: "Fire calls rose 3% in 2025.", paraphrase: true, by: "SCDF statistics 2025", src: S.stats },
      thai: { pic: "panel", n: "14 of 19", nl: "buildings tested after the Toh Guan Road fire had non-compliant cladding", lead: "The drawing was right. The product was not", text: "The external composite panels were not of Class 0 standard as required under the Fire Code.", paraphrase: true, by: "SCDF news release on 30 Toh Guan Road, 2017", src: S.toh },
      bca: { pic: "check", n: "14,750", nl: "fire safety enforcement checks in 2025", lead: "The building is checked long after the certificate", text: "SCDF conducted 14,750 fire safety enforcement checks in 2025.", paraphrase: true, by: "SCDF statistics, 11 February 2026", src: S.stats }
    },
    tilesTitle: "Fire safety in numbers", tilesSub: "What SCDF checked and found in the latest year, and what the submission costs.",
    tiles: [
      { n: "14,750", label: "fire safety enforcement checks", year: "2025", by: "SCDF", src: S.stats },
      { n: "2,668", label: "fire hazard abatement notices issued", year: "2025", by: "SCDF", src: S.stats },
      { n: "1,209", label: "notices of offence issued, up from 1,061", year: "2025", by: "SCDF", src: S.stats },
      { n: "2,050", label: "fires, up from 1,990", year: "2025", by: "SCDF", src: S.stats },
      { n: "S$160", label: "plan fee for each 100 m² of new works with a fire safety measure", year: "current", by: "SCDF", src: S.pc },
      { n: "10 years", label: "experience an architect or PE needs to become a Registered Inspector", year: "current", by: "SCDF", src: S.ri }
    ],
    seriesTitle: "The record", seriesSub: "Fires and fire deaths in Singapore, by year.",
    series: (BS.series || []).filter(function (s) { return /^Fire/.test(s.title); }),
    timeline: [
      { year: "2017", bad: true, event: "Fire at 30 Toh Guan Road. One dead", law: "The cladding was not of the class the Fire Code requires. SCDF tested 19 buildings and found 14 non-compliant.", by: "SCDF news release", src: S.toh },
      { year: "2020", event: "Penalties raised", law: "From 14 September an unauthorised change of use carries up to S$200,000 and 2 years' jail, and SCDF can prosecute serious risks without a notice first.", by: "MHA", src: S.mha },
      { year: "2021", bad: true, event: "Six owners charged over lapsed Fire Certificates", law: "They occupied their buildings without a valid certificate after several reminders.", by: "SCDF news release", src: S.six },
      { year: "2022", bad: true, event: "Car parks put to other uses", law: "Four owners and occupiers were fined S$3,500 to S$4,000 for changing the use without approval.", by: "SCDF news release", src: S.cou },
      { year: "2023", event: "Fire Code 2023", law: "Published on 25 August. Amendments follow in batches by circular.", by: "SCDF", src: S.circ },
      { year: "2024", event: "First amendments take effect", law: "From 1 September, plans submitted must follow the first batch of amendments.", by: "SCDF circulars", src: S.circ },
      { year: "2025", bad: true, event: "Mezzanine collapse at a Toa Payoh warehouse", law: "Reports said the mezzanine had been built without SCDF or BCA approval.", by: "News report", src: S.toa },
      { year: "2026", event: "Fire Certificate valid for three years", law: "Certificates whose validity starts on or after 1 April run for 36 months.", by: "SCDF", src: S.fc }
    ],
    disasters: null, db: null, systems: null
  };

  window.SCDFCASES = [
    toh ? clone(toh, { stage: "Products on site", img: "img/case7.jpg" }) : null,
    { stage: "After handover", tag: "2021 · Fire Certificates", img: "img/case5.jpg", title: "Six buildings occupied on an expired certificate", when: "January to April 2021", where: "Six buildings, Singapore",
      story: [["clock", "The Fire Certificates of six buildings lapse."], ["nostamp", "SCDF sends several reminders. The buildings stay in use without a valid certificate."], ["gavel", "The six owners are charged in court."]],
      big: [["6", "owners charged"], ["S$1,400 to S$2,000", "fines, as reported by the press"], ["2 months", "before expiry, to renew"]],
      lesson: "The submission does not end at the Fire Safety Certificate. Tell the owner at handover when the Fire Certificate is due and who must apply.", grade: "fines from press reports; not stated in SCDF's release", src: [["SCDF news release, 12 May 2021", S.six]] },
    { stage: "Change of use", tag: "2022 · Car parks", img: "img/case3.jpg", title: "The car park that became something else", when: "2021 to 2022", where: "Four premises, Singapore",
      story: [["occupy", "Car park space is put to another use without telling SCDF."], ["nostamp", "No plans are approved and no certificate covers the new use."], ["money", "Four owners and occupiers are charged and fined."]],
      big: [["S$3,500 to S$4,000", "fines"], ["S$200,000", "the maximum since 2020"], ["4", "owners and occupiers"]],
      lesson: "A change of use is fire safety works even when nothing is built. The escape routes and systems were approved for the old use.", src: [["SCDF news release, 4 April 2022", S.cou]] },
    { stage: "Construction", tag: "2025 · Toa Payoh warehouse", img: "img/case4.jpg", title: "The mezzanine nobody approved", when: "February 2025", where: "Warehouse, Toa Payoh",
      story: [["extra", "A mezzanine floor is installed inside a warehouse."], ["nostamp", "The authorities say it was built without SCDF or BCA approval."], ["collapse", "The mezzanine collapses."]],
      big: [["0", "approvals for the mezzanine"], ["2", "authorities whose approval was needed"], ["S$200,000", "maximum fine for unapproved fire safety works"]],
      lesson: "A mezzanine adds floor area, load and travel distance at once. It needs structural and fire safety approval before it goes in.", grade: "from a news report; the enforcement outcome was not found", src: [["Malay Mail, 10 February 2025", S.toa]] }
  ].filter(Boolean);

  var BY = "Compiled from SCDF's pages, the Fire Code and enforcement releases. SCDF does not publish a list of common reasons for disapproval.";
  window.SCDFMIST = [
    { id: "escape", name: "Escape", by: BY, src: S.plans, items: [
      ["Travel distance drawn as a straight line", "It follows the route a person walks, around walls and fittings.", "mismatch"],
      ["A dead end that is too long", "15 m without sprinklers and 20 m with them.", "draft"],
      ["Exits side by side", "Two exits count only if they are remote from each other.", "check"],
      ["Occupant load taken too low", "It comes from the floor area and the use, not from the tenant's headcount.", "mismatch"],
      ["Staircase too narrow for the people", "Width is counted in units of 500 mm, with a 1,000 mm minimum.", "draft"]] },
    { id: "height", name: "Height and access", by: BY, src: S.plans, items: [
      ["Habitable height measured from the wrong level", "It runs from the lowest fire engine accessway to the highest habitable floor.", "mismatch"],
      ["No rising main above 10 m", "Dry above 10 m, wet above 60 m, and in every basement.", "check"],
      ["Accessway too narrow or too far", "6 m wide, or 7 m above 50 m, and within reach of the access openings.", "draft"],
      ["Compartments too large above 24 m", "2,000 m² and one storey each.", "extra"]] },
    { id: "sub", name: "Submission", by: BY, src: S.waiver, items: [
      ["Waiver sent with the plans", "Every waiver must go in before any formal plan submission.", "nostamp"],
      ["Lodging works that are not minor", "Only works on the Schedule may be lodged.", "falsedoc"],
      ["No owner's consent", "A minor A&A lodgment needs the owner's or management corporation's consent first.", "nostamp"],
      ["Drawn to a superseded clause", "Plans submitted after an amendment's effective date must follow it.", "mismatch"],
      ["M&E plans forgotten", "Fire protection and ventilation plans are a separate submission by the M&E engineer.", "nostamp"]] },
    { id: "site", name: "On site", by: BY, src: S.toh, items: [
      ["A product without a current certificate", "At Toh Guan Road the cladding was not of the class the Fire Code requires.", "panel"],
      ["Added on site", "A mezzanine or partition that was never on the approved plans.", "extra"],
      ["Starting before approval", "Up to S$200,000, 24 months' jail, or both.", "gavel"]] },
    { id: "done", name: "Completion", by: BY, src: S.fsc, items: [
      ["Moving in before the certificate", "A building may not be used or occupied without a certificate or permit.", "occupy"],
      ["An inspector with an interest", "The Registered Inspector must have had no part in the design or construction.", "falsedoc"],
      ["Treating the permit as final", "A Temporary Fire Permit is for a limited period, with items still to close.", "clock"],
      ["Inspection before the works are done", "The inspector certifies what is there on the day.", "check"]] },
    { id: "after", name: "After handover", by: BY, src: S.fc, items: [
      ["Fire Certificate allowed to lapse", "Renew at least 2 months before expiry.", "clock"],
      ["No Fire Safety Manager", "Appoint within 90 days of TOP or CSC where one is required.", "nostamp"],
      ["Change of use without approval", "Up to S$200,000 since 2020.", "occupy"],
      ["Blocked exits", "SCDF can now prosecute serious cases without a notice first.", "fire"]] }
  ];

  window.SCDFQUIZ = [
    ["Routes", "When must a waiver application go in?", "Before any formal plan submission", ["Together with the plans", "After plan approval", "Before the certificate"], "SCDF requires every waiver first.", "SCDF, Waiver application"],
    ["Routes", "Which works may be lodged as a minor A&A?", "Only those on the Schedule to regulation 4", ["Any works under S$50,000", "Any works inside one unit", "Any works with no structural change"], "Anything else needs plan approval.", "SCDF, Minor A&A"],
    ["Routes", "What does a performance-based design need besides the QP?", "A fire safety engineer and a separate peer reviewer", ["Two Registered Inspectors", "An accredited checker", "A Fire Safety Manager"], "All three declarations are mandatory.", "SCDF, Performance-based approach"],
    ["Money", "What is the plan fee for new works with a prescribed fire safety measure?", "S$160 per 100 m²", ["S$90 per storey", "S$100 per 100 m²", "S$300 per 100 m²"], "S$100 where there is no such measure.", "SCDF, Plans and consultations"],
    ["Money", "What does a minor A&A lodgment cost?", "S$90", ["Nothing", "S$160", "S$500"], "", "SCDF, Minor A&A"],
    ["Money", "What is the fee for a Fire Safety Certificate?", "No fee", ["S$90", "S$160", "S$33 per storey"], "S$33 per storey is the Fire Certificate, a different document.", "SCDF, FSC and TFP"],
    ["People", "Who engages the Registered Inspector?", "The building owner", ["The builder", "The QP", "SCDF"], "And the inspector must be independent of the project.", "SCDF, Registered Inspector"],
    ["People", "What does a Registered Inspector's Form 2 lead to?", "A Temporary Fire Permit", ["A Fire Safety Certificate", "A Fire Certificate", "A waiver"], "Form 1, full completion, leads to the certificate.", "SCDF, Registered Inspector"],
    ["People", "Within how long of TOP or CSC must a Fire Safety Manager be appointed?", "90 days", ["14 days", "30 days", "12 months"], "", "SCDF, Fire Safety Manager"],
    ["Escape", "What is the one-way travel distance for an office without sprinklers?", "15 m", ["10 m", "30 m", "45 m"], "30 m with sprinklers.", "Fire Code 2023, Table 2.2A"],
    ["Escape", "What is the two-way travel distance for a sprinklered office?", "75 m", ["45 m", "60 m", "100 m"], "45 m without sprinklers.", "Fire Code 2023, Table 2.2A"],
    ["Escape", "What is the minimum width of an exit staircase?", "1,000 mm", ["850 mm", "900 mm", "1,200 mm"], "And it counts for at most 2,000 mm.", "Fire Code 2023, Cl. 2.2.7"],
    ["Escape", "What is the longest dead end without sprinklers?", "15 m", ["10 m", "20 m", "30 m"], "20 m with sprinklers.", "Fire Code 2023, Table 2.2A"],
    ["Height", "Above what habitable height is a rising main needed?", "10 m", ["6 m", "24 m", "60 m"], "It must be wet above 60 m.", "Fire Code 2023, Cl. 6.2"],
    ["Height", "Above what habitable height are fire lifts needed?", "24 m", ["10 m", "18 m", "60 m"], "Most uses also need sprinklers on every storey.", "Fire Code 2023, Cl. 6.6.4"],
    ["Height", "How wide is a fire engine accessway for a building up to 50 m?", "6 m", ["4 m", "5 m", "7 m"], "7 m above 50 m. An access road is 4 m.", "Fire Code 2023, Cl. 4.2.2"],
    ["Penalty", "What is the maximum fine for starting fire safety works without approved plans?", "S$200,000", ["S$10,000", "S$50,000", "S$500,000"], "With up to 24 months' jail.", "Fire Safety Act 1993"],
    ["After", "How long is a Fire Certificate valid where validity starts on or after 1 April 2026?", "36 months", ["12 months", "24 months", "5 years"], "It was 12 months before.", "SCDF, Fire Certificate"]
  ];
})();
