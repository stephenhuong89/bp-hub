/* PLANS data set: how to get the existing approved or as-built drawings of a building before quoting or reviewing.
   Authority processes and fees were researched 17 Nov 2026 from BCA's Plan Purchase page, URA's Buy Planning Records pages, JTC, LTA, SCDF and the National Archives.
   status "practice" marks CVC working practice that is not an authority rule. status "unverified" marks a figure that could not be confirmed on a live official page. */
(function () {
  "use strict";
  var S = {
    pps: "https://bca.gov.sg/pps", elig: "https://www.bca.gov.sg/pps/Doc/Eligibility%20and%20Supporting%20Documents%20Required.pdf", auth1: "https://www.bca.gov.sg/pps/Doc/Authorisation%20Type%201.pdf",
    unauth: "https://www1.bca.gov.sg/public/private-property-ownership/renovation-maintenance-and-building-works-for-private-properties/building-works-that-do-not-require-plan-submission-to-bca",
    ura: "https://www.ura.gov.sg/eservices-info/development-control/buy-dc-planning-records-faq/", urahelp: "https://www.ura.gov.sg/eservices-info/development-control/buy-dc-planning-records-help/", uralr: "https://www.ura.gov.sg/eservices-info/development-control/elrfaq/",
    hdb: "https://www.hdb.gov.sg/residential/living-in-an-hdb-flat/renovation/applying-for-approval", hdbw: "https://www.hdb.gov.sg/cs/infoweb/residential/living-in-an-hdb-flat/renovation/guidelines/building-works",
    jtc: "https://jtc.gov.sg/get-help/development-and-renovation-works/request-for-building-plans", nas: "https://nas.gov.sg/archivesonline/maps_building_plans/faq", nasb: "https://biblioasia.nlb.gov.sg/vol-16/issue-3/oct-dec-2020/building/",
    pub: "https://www.pub.gov.sg/Professionals/Resources/PUB-Services-Plans", inlis: "https://app.sla.gov.sg/inlis/", scdf: "https://www.scdf.gov.sg/docs/default-source/scdf-library/directory-of-fire-safety-services/forms/search-plan-form.pdf",
    lta: "https://www.lta.gov.sg/content/dam/ltagov/industry_innovations/industry_matters/development_construction_resources/road_line_plan/pdf/road_line_plan_faq_final_jan2023.pdf",
    mc: "https://www1.bca.gov.sg/docs/default-source/docs-corp-regulatory/building-maintenance-and-strata-management/smg8-maintaining-mc-records.pdf"
  };
  var CVC = "CVC practice";

  /* what the drawing checker looks for on a sheet the client sent */
  var rules = [
    ["k-type", "id", "Kind of drawing", "A construction drawing, not a sales layout", "A construction drawing has a title block, grid lines, dimensions and a stated scale. A sales brochure or agent's layout has furniture, colour and room names but none of those, and we cannot quote from it.", "Title block, grid bubbles, dimension strings and a scale. Furniture, colour fills and marketing text point to a brochure."],
    ["k-disc", "id", "Kind of drawing", "The discipline can be told", "Architectural plans show walls, doors, windows and room names. Structural plans show beams, columns, slabs and foundations with marks and sizes. M&E plans show ducts, pipes and equipment.", "Sheet title and what the linework represents. State whether it is architectural, structural, M&E, survey or other."],
    ["k-struct", "id", "Kind of drawing", "Structural information is shown", "To quote structural works we need member marks and sizes, reinforcement, or foundation details. An architectural plan alone shows where walls are but not what is holding the building up.", "Beam and column marks such as B1 or C3, member sizes, reinforcement such as T16-150, slab thickness, pile or footing details."],
    ["k-title", "id", "Title block", "The title block is complete", "A proper sheet states the project and its address, the drawing title, a drawing number, the scale and a date.", "Each of those items in the title block. Say which are missing."],
    ["k-qp", "use", "Authority", "Endorsed by a qualified person", "An approved plan carries the name and endorsement of the architect or professional engineer who submitted it.", "A PE or architect's name, registration number, stamp or signature block."],
    ["k-appr", "use", "Authority", "Carries an authority approval or plan reference", "Plans bought from BCA are copies of the approved plans and normally carry an approval stamp or a plan reference number. A drawing with neither may be a draft or a contractor's shop drawing.", "An approval stamp, the words approved or record plan, or a plan or project reference number."],
    ["k-addr", "use", "Authority", "The address matches the client's property", "Drawings for the wrong block, the wrong unit or the neighbouring lot are a common mix-up.", "Address, lot number or unit number in the title block against the address given by the user."],
    ["k-latest", "use", "Version", "It is the latest version", "Buildings are altered. The original approval may have been followed by amendments and later addition and alteration plans, and we need the latest for the area of work.", "Revision table, amendment clouds, dates, and the words amendment or additions and alterations."],
    ["k-asbuilt", "use", "Version", "Marked as an as-built or record plan", "A record or as-built plan shows what was built. An approved plan shows what was permitted. Either can differ from the building today.", "The words as-built, record plan or as constructed."],
    ["k-legible", "use", "Quality", "Dimensions and text are legible", "A phone photo of a folded print often loses the dimensions and the reinforcement notes we need.", "Whether dimensions, marks and notes can actually be read. Quote one you can read, or say none can."],
    ["k-scale", "use", "Quality", "Drawn to a stated scale", "A stated scale, with at least a few dimensions, lets us take off quantities.", "The scale in the title block or under the drawing title."],
    ["k-grid", "set", "Completeness", "Grid lines and levels are shown", "Grid lines and floor levels let us match this sheet to the others and to the site.", "Grid bubbles with letters and numbers, and a floor level or storey name."],
    ["k-sheet", "set", "Completeness", "The sheet numbering shows the size of the set", "A sheet marked 3 of 18 tells us fifteen more exist. One loose sheet is rarely enough.", "Sheet number and total, or a drawing list."],
    ["k-found", "set", "Completeness", "Foundation information is present", "Any work that adds load, such as a mezzanine, an attic or rooftop equipment, needs the foundation or piling plan.", "Pile or footing layout, pile type, size and capacity."],
    ["k-notes", "set", "Completeness", "Design loads and material grades are stated", "The general notes give the imposed loads the floor was designed for and the concrete and steel grades.", "A general notes sheet or box with imposed load in kN/m², concrete grade and steel grade."]
  ].map(function (r) { return { id: "pl-r-" + r[0], kind: "rule", scope: r[1], agency: "CVC", topic: r[2], status: "practice", title: r[3], body: r[4], evidence: r[5], ref: CVC, src: "" }; });

  var process = [
    ["bca", "BCA", "BCA Plan Purchase", "BCA's Plan Purchase service sells copies of the approved building plans and structural plans it holds for an address. The owner applies online with Singpass. BCA replies within 10 working days on what is available, and the plans are then viewed and downloaded from its portal.", "BCA, Plan Purchase", S.pps, "verified"],
    ["bca-fee", "BCA", "BCA's fees", "The search fee is S$45 for each address, paid on application. Each set of plans is then S$65, charged for each plan reference number and paid after the plans are chosen. Both include GST. Older search results still show S$35 and S$45, so confirm on BCA's page.", "BCA, Plan Purchase", S.pps, "verified"],
    ["bca-who", "BCA", "Who may apply to BCA", "Four kinds of applicant: the registered owner of a private property, the staff of a company that owns it, the chairman of the management corporation, or a person authorised by any of them. Each has its own authorisation form.", "BCA, Eligibility and supporting documents required", S.elig, "verified"],
    ["bca-docs", "BCA", "What the owner must attach", "A private owner attaches the current property tax statement showing the owner's full name and the address. A company adds its authorisation form on letterhead and its ACRA BizFile. A management corporation uses the property tax statement in its name or the SLA certificate of constitution.", "BCA, Eligibility and supporting documents required", S.elig, "verified"],
    ["bca-hdb", "BCA", "HDB units at BCA", "An HDB owner cannot apply to BCA as an owner. The application is made as an authorised person, with an authorisation form signed by HDB.", "BCA, Eligibility and supporting documents required", S.elig, "verified"],
    ["bca-what", "BCA", "What BCA's set contains", "The approved architectural and structural drawings BCA keeps, supplied as they are, with no warranty. Electrical and plumbing layouts are not included. Whether structural calculations can be bought was not confirmed.", "BCA, earlier legal search page", "https://www.bca.gov.sg/legalsearch/LegalSearchapp.aspx", "unverified"],
    ["bca-limit", "BCA", "What a search does not tell you", "BCA says a search does not guarantee that a property has no unauthorised structures, and advises engaging an architect, engineer or building surveyor to check the building against the approved plans.", "BCA, building works for private properties", S.unauth, "verified"],
    ["nas", "NAS", "Buildings from before 1970", "The National Archives holds about 246,000 building plans from 1884 to 1969. It tells current owners and buyers to apply to BCA first for approved drawings.", "National Archives of Singapore, FAQ on building plans", S.nas, "verified"],
    ["ura", "URA", "URA sells planning records, not structural plans", "URA's Buy Planning Records service sells PDF copies of the approved plans from the written permission, and copies of the grant itself. These show the approved use, layout and floor area. For beams, columns and foundations, go to BCA.", "URA, Buy planning records FAQ", S.ura, "verified"],
    ["ura-fee", "URA", "URA's fees", "The search is S$109 for each application and a set of approved plans is S$27.25, both including GST. Fees are not refunded if nothing is found. Results are emailed within 10 working days.", "URA, Buy planning records FAQ", S.ura, "verified"],
    ["ura-who", "URA", "What URA asks for", "Proof of ownership or the owner's letter of authorisation, and the property's address, lot number and MK or TS number, which come from SLA's INLIS.", "URA, Buy planning records FAQ and help", S.urahelp, "verified"],
    ["hdb", "HDB", "HDB flat floor plan", "HDB sells a copy of a flat's floor plan for S$5 through its e-service or at HDB Hub. A flat bought new from HDB may have the plan in its sales brochure. The official page could not be opened to confirm the fee.", "HDB, Applying for renovation approval", S.hdb, "unverified"],
    ["hdb-wall", "HDB", "Structural walls in an HDB flat", "Reinforced concrete walls and other structural elements may not be hacked. Whether HDB sells structural plans to owners was not found, so for HDB work ask HDB which walls are structural before quoting.", "HDB, Building works guidelines", S.hdbw, "unverified"],
    ["jtc", "JTC", "JTC buildings and land", "JTC gives building plans to its tenants and lessees, and to their qualified person or project manager with an authorisation letter. It covers buildings JTC built and lessee buildings on JTC land developed from 1997 to 2004. The outcome is emailed within 3 working days and the fee is waived for online requests.", "JTC, Request for building plans", S.jtc, "verified"],
    ["svc", "PUB and LTA", "Sewer, drain, water and road line plans", "PUB's sewerage, drainage and water service plans and LTA's road line plan are bought through SLA's INLIS. Their current fees were not confirmed.", "PUB, Services plans; LTA, Road line plan FAQ", S.pub, "unverified"],
    ["scdf", "SCDF", "Fire safety plans", "SCDF has an application form to inspect or copy the fire safety records it keeps. A non-owner needs the owner's letter of authorisation. The form lists S$27 to search and S$27 for a set of copies, but its date is not known.", "SCDF, Application for inspection or copy of record", S.scdf, "unverified"],
    ["mcst", "MCST", "Records held by a management corporation", "A management corporation keeps the records handed over by the developer, and an owner may apply in writing to inspect its records for a prescribed fee. Whether that right covers the building plans, and the fee, were not confirmed.", "Building (Strata Management) Act 2004; BCA strata management guide 8", S.mc, "unverified"],
    ["asis", "All", "A plan is not the building", "JTC and BCA both say the plans may not show later changes. Treat every purchased plan as a starting point and check it against the site.", "JTC, Request for building plans", S.jtc, "verified"]
  ].map(function (r) { return { id: "pl-" + r[0], kind: "rule", scope: "buy", agency: r[1], topic: "Getting plans", status: r[5], checkable: false, title: r[2], body: r[3], ref: r[4], src: r[5] === undefined ? "" : (typeof r[4] === "string" ? "" : "") }; });
  /* the source URL sits at index 4 of each row above, with the reference text at index 3 */
  [S.pps, S.pps, S.elig, S.elig, S.elig, "https://www.bca.gov.sg/legalsearch/LegalSearchapp.aspx", S.unauth, S.nas, S.ura, S.ura, S.urahelp, S.hdb, S.hdbw, S.jtc, S.pub, S.scdf, S.mc, S.jtc].forEach(function (u, i) { process[i].src = u; });
  ["BCA, Plan Purchase", "BCA, Plan Purchase", "BCA, Eligibility and supporting documents required", "BCA, Eligibility and supporting documents required", "BCA, Eligibility and supporting documents required", "BCA, earlier legal search page", "BCA, building works for private properties", "National Archives of Singapore, FAQ on building plans", "URA, Buy planning records FAQ", "URA, Buy planning records FAQ", "URA, Buy planning records FAQ and help", "HDB, Applying for renovation approval", "HDB, Building works guidelines", "JTC, Request for building plans", "PUB, Services plans; LTA, Road line plan FAQ", "SCDF, Application for inspection or copy of record", "Building (Strata Management) Act 2004; BCA strata management guide 8", "JTC, Request for building plans"].forEach(function (t, i) { process[i].ref = t; });
  ["verified", "verified", "verified", "verified", "verified", "unverified", "verified", "verified", "verified", "verified", "verified", "unverified", "unverified", "verified", "unverified", "unverified", "unverified", "verified"].forEach(function (t, i) { process[i].status = t; });

  var terms = [
    ["t-asbuilt", "As-built drawing", "What we call the drawings of an existing building. Strictly, an as-built or record plan shows what was constructed, and an approved plan shows what the authority permitted. BCA sells the approved plans."],
    ["t-bp", "Building plan (BP)", "The architect's plans approved by BCA: floor plans, sections and elevations showing walls, doors, stairs and rooms. They show the layout, not the size of the structure."],
    ["t-st", "Structural plan (ST)", "The engineer's plans approved by BCA: foundations, columns, beams, slabs and their reinforcement. This is the set we need to quote or review structural work."],
    ["t-frame", "Framing plan", "A structural plan of one floor, seen from above, showing every beam, column and slab panel with its mark."],
    ["t-found", "Foundation or piling plan", "The structural plan of what is in the ground: footings or pile caps, piles, and their sizes and capacities."],
    ["t-detail", "Details and schedules", "Sections through beams, columns and slabs showing reinforcement, and tables listing the size and steel for each mark."],
    ["t-amend", "Amendment plan", "A later submission that changes part of an approved plan. It replaces the earlier sheet for that part."],
    ["t-aa", "Addition and alteration (A&A) plan", "Plans for later works to an existing building, such as an attic, an extension or a new opening. They are filed under their own plan reference number."],
    ["t-ref", "Plan reference number", "The number under which a set of plans was submitted. BCA charges for each one, so each is a separate set."],
    ["t-title", "Title block", "The box on every sheet that states the project, the address, the drawing title and number, the scale, the date and who prepared it."],
    ["t-wp", "Written permission plan", "The plan URA approved for planning permission. It shows use, layout and floor area, and no structure."],
    ["t-broch", "Sales brochure or layout", "A marketing plan from a developer or agent, usually coloured and furnished. It is not a construction drawing."],
    ["t-strata", "Strata plan and survey plan", "A surveyor's plan of lot or unit boundaries and areas, kept by SLA. It shows who owns what, not how it is built."],
    ["t-loa", "Letter of authorisation", "The owner's signed form allowing someone else to apply for the plans. BCA has a different form for a private owner, a company and a management corporation."],
    ["t-pts", "Property tax statement", "IRAS's yearly statement naming the owner and the address. BCA uses it as proof of ownership."],
    ["t-me", "M&E plan", "Mechanical and electrical plans: air-conditioning, electrical, plumbing and fire protection. BCA's set does not include electrical and plumbing layouts."]
  ].map(function (t) { return { id: "pl-" + t[0], kind: "term", agency: "CVC", status: "practice", title: t[1], body: t[2], ref: CVC, src: "" }; });

  function opt(id, label, qp, verdict, vlabel, basis, detail, ref, src, tags, conf) { return { id: id, label: label, qp: qp, verdict: verdict, vlabel: vlabel, confidence: conf || "High", basis: basis, detail: detail, ref: ref, src: src, tags: tags }; }

  var LINKS = '<div class="panel"><h3>Links to buy the plans</h3><div class="linkgrid">' +
    [["BCA", "Plan Purchase: start here", "Fees, steps and the two buttons below.", "https://bca.gov.sg/pps"],
     ["BCA", "Submit a new application", "The online form. Log in with Singpass. S$45 an address.", "https://go.gov.sg/bcapps"],
     ["BCA", "View and download the plans", "The portal BCA opens to you after its reply. Choose the sets here, S$65 each.", "https://www.bca.gov.sg/singpassauthen/encrypt_Portal_Mbr.aspx?ID=FD3162C9-8476-43B6-B05D-053FE177902A"],
     ["BCA", "Who may apply and what to attach", "Read this before applying. It lists the four kinds of applicant.", "https://www.bca.gov.sg/pps/Doc/Eligibility%20and%20Supporting%20Documents%20Required.pdf"],
     ["BCA form", "Authorisation form: private owner", "Type 1. The owner signs it so someone else may apply.", "https://www.bca.gov.sg/pps/Doc/Authorisation%20Type%201.pdf"],
     ["BCA form", "Authorisation form: company owner", "Type 2. On the company's letterhead, signed by an authorised signatory.", "https://www.bca.gov.sg/pps/Doc/Authorisation%20Type%202.pdf"],
     ["BCA form", "Authorisation form: management corporation", "Type 3. Signed by the chairman.", "https://www.bca.gov.sg/pps/Doc/Authorisation%20Type%203.pdf"],
     ["URA", "Buy planning records: how it works", "Planning plans only: approved use, layout and floor area. S$109 to search.", "https://www.ura.gov.sg/eservices-info/development-control/buy-dc-planning-records-help/"],
     ["URA", "Buy planning records: questions and fees", "What you can buy, who may buy and the charges.", "https://www.ura.gov.sg/eservices-info/development-control/buy-dc-planning-records-faq/"],
     ["JTC", "Request for building plans", "For JTC buildings. Reply in 3 working days, fee waived online.", "https://www.jtc.gov.sg/get-help/development-and-renovation-works/request-for-building-plans"],
     ["SLA", "INLIS", "Lot numbers, survey plans, and PUB and LTA service plans.", "https://app.sla.gov.sg/inlis/"],
     ["SCDF", "Form to inspect or copy fire safety records", "Where the works affect exits or compartments.", "https://www.scdf.gov.sg/docs/default-source/scdf-library/directory-of-fire-safety-services/forms/search-plan-form.pdf"],
     ["NAS", "National Archives: building plans", "Plans from 1884 to 1969. Apply to BCA first.", "https://www.nas.gov.sg/archivesonline/maps_building_plans/faq"]
    ].map(function (l) { return '<a class="linkcard" href="' + l[3] + '" target="_blank" rel="noopener"><small>' + l[0] + "</small><b>" + l[1] + "</b><span>" + l[2] + "</span></a>"; }).join("") +
    '</div><p class="small">Checked on 17 Nov 2026. For an HDB unit the authorisation must be signed by HDB; BCA\'s eligibility document gives the contact. If a link has moved, start from BCA\'s Plan Purchase page.</p></div>';
  window.PLANSLINKS = LINKS;
  window.PLANSDATA = {
    meta: { asOf: "17 Nov 2026", setName: "getting the as-built drawings", note: "Internal training guide for CVC Engineers. Fees and processes change; confirm them on the authority's page before telling a client. Purchased plans show what was approved and may differ from the building today." },
    synonyms: { asbuilt: ["as-built", "as built", "record plan", "existing drawings"], st: ["structural plan", "structural drawing"], bp: ["building plan", "architectural plan", "archi plan"], loa: ["letter of authorisation", "authorisation form"], mcst: ["management corporation", "managing agent"], pps: ["plan purchase"], wp: ["written permission"], hdb: ["flat"] },
    who: {
      buckets: [["pe", "Ask first: free", "People who may already hold the drawings"], ["either", "Buy from the authority", "A search fee, then a fee for each set"], ["architect", "Nothing on record", "Measure and investigate"]],
      headlineHtml: '<div class="note bad"><b>We cannot quote or review from a layout.</b> Before anyone pays an authority, find out what the works are and who may already hold the drawings.</div><div class="panel"><h3>The order to try</h3><div class="prose"><ol><li><b>Ask who already has them.</b> The seller, the management corporation, the original architect or engineer, or the developer. This costs nothing.</li><li><b>Buy the approved plans.</b> BCA holds the building plans and structural plans. URA holds planning plans only. HDB and JTC hold plans for their own buildings.</li><li><b>If nothing exists, measure and investigate.</b> A surveyor measures the building and we investigate the structure.</li></ol></div></div>' + LINKS,
      notesHtml: '<h3>BCA or URA?</h3><ul><li><b>BCA</b> holds the approved <b>building plans</b>, which are the architect\'s, and the approved <b>structural plans</b>, which are the engineer\'s. For our work, this is where to go.</li><li><b>URA</b> holds the <b>planning plans</b> from the written permission. They prove the approved use and floor area. They do not show structure, and the search costs more.</li><li>Both need the owner: either the owner applies, or the owner signs an authorisation form.</li></ul>',
      options: [
        opt("seller", "The seller or previous owner", "Client asks", "pe", "Ask first", "Owners are often handed a set of plans at purchase or after renovation.", "Ask the client's conveyancing lawyer too.", CVC, "", "resale handover", "Medium"),
        opt("mcst", "Management corporation or managing agent", "Client asks, as an owner", "pe", "Ask first", "The management corporation keeps the records the developer handed over, which normally include the as-built set for the whole development.", "An owner may apply in writing to inspect its records. Works to common property need the management corporation anyway.", "BCA strata management guide 8", S.mc, "condo strata mcst", "Medium"),
        opt("qp", "The original architect or engineer", "Client or CVC asks", "pe", "Ask first", "Their name is on the title block and on BCA's approval. Many firms keep their drawings.", "They may charge, and the copyright is theirs.", CVC, "", "consultant designer", "Medium"),
        opt("dev", "The developer", "Client asks", "pe", "Ask first", "For a recent development the developer may still supply plans to an owner.", "", CVC, "", "new launch", "Medium"),
        opt("bca", "Private house, shophouse, condo unit or factory", "The owner, with Singpass and the property tax statement", "either", "BCA Plan Purchase", "BCA sells copies of the approved building and structural plans it holds for the address.", "S$45 to search the address, then S$65 for each plan reference number. A reply within 10 working days.", "BCA, Plan Purchase", S.pps, "landed bungalow terrace structural"),
        opt("bcaco", "Property owned by a company", "A staff member, with the company's authorisation form and BizFile", "either", "BCA Plan Purchase", "The company authorises a staff member on its letterhead.", "Property tax statement and ACRA BizFile attached.", "BCA, Eligibility and supporting documents required", S.elig, "corporate pte ltd"),
        opt("bcaus", "We apply for the client", "CVC, as the authorised person", "either", "BCA Plan Purchase", "An authorised person may apply for a private owner, a company, a management corporation or an HDB unit, with the signed authorisation form.", "This is usually faster than coaching a client through it.", "BCA, Eligibility and supporting documents required", S.elig, "agent authorised"),
        opt("hdb", "HDB flat or HDB shop", "The owner for the floor plan; an authorised person for BCA plans", "either", "HDB, then BCA", "HDB sells the flat's floor plan. For plans at BCA, the form must be signed by HDB.", "Reinforced concrete walls may not be hacked. Ask HDB which walls are structural.", "BCA, Eligibility and supporting documents required", S.elig, "flat bto resale", "Medium"),
        opt("jtc", "JTC building or land", "The tenant or lessee, or their QP with an authorisation letter", "either", "JTC request", "JTC gives architectural, structural and M&E plans for buildings it built, and for lessee buildings developed from 1997 to 2004.", "Reply within 3 working days, and the fee is waived for online requests.", "JTC, Request for building plans", S.jtc, "factory industrial"),
        opt("ura", "Approved use, layout or floor area is in question", "The owner, or with the owner's authorisation", "either", "URA planning records", "URA sells the plans from the written permission. They show what use and floor area were approved.", "S$109 to search and S$27.25 for a set. No structure is shown.", "URA, Buy planning records FAQ", S.ura, "change of use gfa extension"),
        opt("old", "Building from before 1970", "The owner", "either", "BCA first, then the National Archives", "The National Archives holds plans from 1884 to 1969, and tells owners to apply to BCA first.", "Expect gaps. A pre-war shophouse may have nothing structural.", "National Archives of Singapore", S.nas, "shophouse conservation prewar"),
        opt("svc", "Sewers, drains, water pipes or the road line", "Anyone, through INLIS", "either", "SLA INLIS", "PUB's service plans and LTA's road line plan are bought through INLIS.", "Needed for extensions, basements and piling.", "PUB, Services plans", S.pub, "sewer drain road"),
        opt("fire", "Fire safety plans", "The owner, or with the owner's authorisation", "either", "SCDF records", "SCDF has a form to inspect or copy the fire safety plans it keeps.", "Useful where the works change exits or compartments.", "SCDF application form", S.scdf, "fire escape"),
        opt("none", "Nothing can be found", "Registered surveyor and CVC", "architect", "Survey and investigate", "A surveyor measures the building. We then find the structure by scanning for reinforcement, coring and trial pits.", "Quote this as a separate first stage, before the design fee.", CVC, "", "no records measured survey", "Medium")
      ]
    },
    lanes: ["Our side", "BCA", "URA"],
    tracks: [{ id: "priv", label: "Private house or shophouse" }, { id: "strata", label: "Condo or strata unit" }, { id: "hdb", label: "HDB" }, { id: "ind", label: "Factory or commercial" }],
    steps: [
      { id: "g-ask", col: 0, lanes: [0, 0], untimed: true, title: "Ask what the works are", tracks: ["priv", "strata", "hdb", "ind"], agency: "CVC", lead: "Whoever takes the call", status: "practice",
        what: ["What does the client want to do: hack, add, extend, change use?", "The full address and unit number.", "What drawings they hold, and a photo of the title block of each."], out: ["A clear idea of which drawings the job needs."],
        hurdles: ["Asking for drawings before knowing the works.", "Accepting the word drawings without seeing them."], ask: ["What exactly do you want to change?", "Can you send a photo of the bottom right corner of each drawing you have?"], ref: CVC, src: "" },
      { id: "g-id", col: 1, lanes: [0, 0], untimed: true, title: "Identify what they sent", tracks: ["priv", "strata", "hdb", "ind"], agency: "CVC", lead: "Whoever takes the call", status: "practice",
        what: ["Sort each sheet: brochure, architectural, structural, M&E, survey.", "Check the address, the date and whether it is approved."], out: ["A list of what is in hand and what is missing."], hurdles: ["Treating an agent's layout as a plan.", "Missing that the sheets are for another unit."],
        ask: ["Use Check a drawing in this hub on what they sent."], ref: CVC, src: "" },
      { id: "g-free", col: 2, lanes: [0, 0], untimed: true, title: "Try the people who may hold them", tracks: ["priv", "strata", "hdb", "ind"], agency: "Client", lead: "Client, with our wording", status: "practice",
        what: ["Seller or previous owner, and the conveyancing lawyer.", "Management corporation or managing agent.", "The original architect or engineer named on any sheet.", "JTC, for a JTC building."], out: ["Drawings at no cost, or a firm no."],
        hurdles: ["Waiting weeks on a managing agent with no deadline."], ask: ["Give it one week, then buy from BCA."], ref: CVC, src: "" },
      { id: "g-own", col: 3, lanes: [0, 0], untimed: true, title: "Prove ownership and authorise", tracks: ["priv", "strata", "hdb", "ind"], agency: "Client", lead: "Client", status: "verified",
        what: ["The current property tax statement, showing the owner's name and the address.", "The right authorisation form: owner, company or management corporation.", "For an HDB unit, the form signed by HDB."], out: ["A complete application, so BCA does not send it back."],
        hurdles: ["The tenant applies, not the owner.", "A company-owned property with no letterhead authorisation or BizFile."], ask: ["Whose name is on the property tax bill?"], ref: "BCA, Eligibility and supporting documents required", src: S.elig },
      { id: "g-apply", col: 4, lanes: [2, 2], untimed: true, title: "Apply and pay the search fee", tracks: ["priv", "strata", "hdb", "ind"], agency: "BCA", lead: "Owner or CVC as authorised person", status: "verified",
        what: ["Log in to BCA Plan Purchase with Singpass.", "Enter the address and attach the documents.", "Pay S$45 for the address."], out: ["An application reference."], hurdles: ["The wrong address: a corner unit or a renumbered lot.", "Expecting the plans the same day."],
        ask: ["Is the address exactly as on the property tax statement?"], ref: "BCA, Plan Purchase", src: S.pps },
      { id: "g-wait", col: 5, lanes: [2, 2], tatMin: 10, tatMax: 10, tatNote: "within 10 working days", title: "BCA says what it holds", tracks: ["priv", "strata", "hdb", "ind"], agency: "BCA", lead: "BCA", status: "verified",
        what: ["BCA checks its records for the address."], out: ["Access to the view and download portal, listing the plans by plan reference number."], hurdles: ["No structural plans on record for an old building.", "The search fee is spent whatever is found."],
        ask: ["Has the client forwarded BCA's reply to us before choosing?"], ref: "BCA, Plan Purchase", src: S.pps },
      { id: "g-pick", col: 6, lanes: [0, 0], untimed: true, title: "Choose the right sets", tracks: ["priv", "strata", "hdb", "ind"], agency: "CVC", lead: "CVC engineer, with the client", status: "practice",
        what: ["The structural plans of the original building.", "Every later structural set that touches the area of work.", "The piling or foundation set where load is being added.", "The building plans only where the layout matters."], out: ["A short list, each at S$65."],
        hurdles: ["Buying only the building plans.", "Missing the later A&A set.", "Buying everything."], ask: ["Send us the list before you pay. We will tick the ones to buy."], ref: CVC, src: "" },
      { id: "g-check", col: 7, lanes: [0, 0], untimed: true, title: "Check what arrived", tracks: ["priv", "strata", "hdb", "ind"], agency: "CVC", lead: "CVC engineer", status: "practice",
        what: ["Address and unit on the title block.", "Every floor's framing plan, the details and the foundation plan.", "Legible dimensions and reinforcement.", "The latest amendment for the area of work."], out: ["A set we can quote from, or a named gap."],
        hurdles: ["A set that stops at the framing plans, with no details."], ask: ["Run the sheets through Check a drawing."], ref: CVC, src: "" },
      { id: "g-ura", col: 7, lanes: [2, 2], tatMin: 10, tatMax: 10, tatNote: "within 10 working days", title: "URA planning records, where use or floor area matters", tracks: ["priv", "ind"], agency: "URA", lead: "Owner", status: "verified",
        what: ["Address, lot number and MK or TS number from INLIS.", "Proof of ownership or the owner's authorisation."], out: ["PDF copies of the plans from the written permission."], hurdles: ["Buying these expecting structural drawings.", "The S$109 search fee is not refunded if nothing is found."],
        ask: ["Is the question what is allowed, or what is holding it up?"], ref: "URA, Buy planning records FAQ", src: S.ura },
      { id: "g-site", col: 8, lanes: [0, 0], untimed: true, title: "Check the plans against the building", tracks: ["priv", "strata", "hdb", "ind"], agency: "CVC", lead: "CVC engineer", status: "verified",
        what: ["A walk-through with the plans in hand.", "Any wall, opening or floor that is not on the plans."], out: ["A quote that states what it is based on."], hurdles: ["Unauthorised works by a previous owner.", "Assuming the plans are right because BCA sold them."],
        ask: ["Has anything been changed since the owner bought it?"], ref: "BCA, building works for private properties", src: S.unauth },
      { id: "g-none", col: 8, lanes: [0, 0], untimed: true, title: "Nothing on record: survey and investigate", tracks: ["priv", "ind"], agency: "CVC", lead: "Registered surveyor and CVC", status: "practice",
        what: ["A measured survey of the building.", "Scanning for reinforcement, coring for concrete strength, and trial pits at the foundations."], out: ["Our own record drawings of the structure."], hurdles: ["The client expecting a design fee quote before this stage is done."],
        ask: ["Will the client pay for an investigation stage first?"], ref: CVC, src: "" }
    ],
    processNotesHtml: '<h3>How to read the times</h3><ul><li>BCA and URA each allow themselves 10 working days. Tell the client two to three weeks from application to drawings in hand.</li><li>The free sources can be faster or far slower. Put a one-week limit on them.</li><li>JTC replies in 3 working days, which makes it the quickest authority.</li></ul>' + LINKS,
    fees: {
      fields: [
        { id: "addr", label: "Addresses to search at BCA", type: "number", def: 1 },
        { id: "sets", label: "Plan reference numbers to buy from BCA", type: "number", def: 2 },
        { id: "ura", label: "Also buy URA planning records", type: "select", options: [["n", "No"], ["y", "Yes"]], def: "n" },
        { id: "usets", label: "Sets of URA approved plans", type: "number", def: 1 },
        { id: "hdb", label: "HDB flat floor plans", type: "number", def: 0 }
      ],
      items: [
        { id: "pl-bca-s", agency: "BCA", label: "Search fee", status: "verified", ref: "BCA, Plan Purchase", src: S.pps, desc: "$45 for each address, including GST, paid on application. It is spent whatever the search finds.",
          calc: function (p) { var n = Math.max(0, p.addr || 0); return { amount: 45 * n, basis: n + " address(es) x $45" }; } },
        { id: "pl-bca-p", agency: "BCA", label: "Plan purchase fee", status: "verified", ref: "BCA, Plan Purchase", src: S.pps, desc: "$65 for each plan reference number, which is one set, including GST. Paid after the plans are chosen.",
          calc: function (p) { var n = Math.max(0, p.sets || 0); return { amount: 65 * n, basis: n + " set(s) x $65" }; } },
        { id: "pl-ura", agency: "URA", label: "Planning records", status: "verified", ref: "URA, Buy planning records FAQ", src: S.ura, desc: "$109 for the search and $27.25 for each set of approved plans, including GST. Certified copies cost $5.45 a sheet more.",
          when: function (p) { return p.ura === "y"; }, calc: function (p) { var n = Math.max(0, p.usets || 0); return { amount: 109 + 27.25 * n, basis: "$109 search + " + n + " set(s) x $27.25" }; } },
        { id: "pl-hdb", agency: "HDB", label: "Flat floor plan", status: "unverified", ref: "HDB, Applying for renovation approval", src: S.hdb, desc: "$5 a copy. The official page could not be opened to confirm it.",
          when: function (p) { return p.hdb > 0; }, calc: function (p) { return { amount: 5 * p.hdb, basis: p.hdb + " x $5" }; } }
      ],
      notesHtml: '<h3>What this estimate leaves out</h3><ul><li>JTC plans, where the fee is waived for online requests.</li><li>INLIS charges for PUB and LTA plans, and SCDF\'s copying charges, which were not confirmed.</li><li>A measured survey and a structural investigation, where nothing is on record.</li><li>Our time. Decide before the call whether helping the client buy plans is free or charged.</li></ul>'
    },
    facts: [
      { id: "name", label: "Client or project", type: "text" },
      { id: "addr", label: "Property address and unit", type: "text" },
      { id: "btype", label: "Building", type: "select", options: [["landed", "Landed house"], ["shop", "Shophouse"], ["strata", "Condo or strata unit"], ["hdb", "HDB flat or shop"], ["jtc", "Factory on JTC land"], ["ind", "Private factory or commercial"]], def: "landed" },
      { id: "works", label: "What the client wants to do", type: "select", options: [["hack", "Hack a wall or form an opening"], ["add", "Add a floor, mezzanine or attic"], ["ext", "Extend the building"], ["roof", "Put load on the roof: solar, tank, equipment"], ["use", "Change the use or load heavier"], ["defect", "Look at a crack or defect"], ["new", "Demolish and rebuild"]], def: "hack" },
      { id: "year", label: "Year built, if known", type: "number" },
      { id: "has", label: "What they say they have", type: "select", options: [["none", "Nothing"], ["layout", "A layout from the agent or brochure"], ["reno", "Renovation or interior drawings"], ["some", "Some approved plans"], ["full", "A full set"]], def: "layout" }
    ],
    pathway: function (p) {
      var out = [];
      var need = { hack: "the framing plan of that floor and the floor above, and the details of the beams and walls affected", add: "the framing plans of every floor, the column schedule and the foundation or piling plan, because the added load goes to the ground",
        ext: "the foundation and framing plans where the new meets the old. Check URA's approved floor area too", roof: "the roof framing plan, the columns below and the foundation plan", use: "the framing plans and the general notes giving the design load. Check the approved use with URA",
        defect: "the framing plan and details for the affected area", "new": "little of the old structure, but a survey plan and the neighbours' party wall details" }[p.works];
      if (need) out.push({ level: "info", text: "For this job we need " + need + ".", ref: "CVC practice" });
      if (p.has === "layout" || p.has === "none" || p.has === "reno") out.push({ level: "bad", text: (p.has === "layout" ? "A layout is not a drawing. " : p.has === "reno" ? "Interior drawings do not show the structure. " : "") + "We cannot quote yet. Start with who may hold the plans, then BCA.", ref: "CVC practice" });
      var b = { landed: ["info", "Private property: the owner applies to BCA Plan Purchase with the property tax statement. S$45 to search, then S$65 a set."], shop: ["warn", "Shophouse: check whether it is conserved, and expect thin records if it is pre-war. Apply to BCA first."],
        strata: ["info", "Strata unit: ask the management corporation first. It usually holds the as-built set, and its consent is needed for common property."], hdb: ["warn", "HDB: the owner cannot apply to BCA directly. The form must be signed by HDB. Reinforced concrete walls may not be hacked."],
        jtc: ["info", "JTC: request the plans from JTC with the lessee's authorisation. A reply comes in 3 working days and the fee is waived."], ind: ["info", "Company-owned: BCA needs the company's authorisation on letterhead, the property tax statement and the BizFile."] }[p.btype];
      if (b) out.push({ level: b[0], text: b[1], ref: "BCA, Eligibility and supporting documents required" });
      if (p.year && p.year < 1970) out.push({ level: "warn", text: "Built before 1970: BCA may hold little. The National Archives keeps plans from 1884 to 1969. Allow for a survey and investigation.", ref: "National Archives of Singapore" });
      if (p.works === "ext" || p.works === "use") out.push({ level: "info", text: "URA's planning records show the approved use and floor area: S$109 to search and S$27.25 a set.", ref: "URA, Buy planning records FAQ" });
      return out;
    },
    scopes: [{ id: "all", label: "All drawing checks" }, { id: "id", label: "What kind of drawing is it" }, { id: "use", label: "Can we rely on it" }, { id: "set", label: "Is the set complete" }],
    playbook: [
      { stage: "1. The first call", ask: ["What do you want to change, and where in the building?", "The full address and unit number.", "A photo of the bottom right corner of every drawing you have."], check: ["That we know the works before asking for drawings."], chase: ["The photos, the same day."] },
      { stage: "2. What they sent", ask: ["Where did these drawings come from?"], check: ["Brochure, architectural, structural, M&E or survey.", "The address and the date on each sheet."], chase: ["A clear scan in place of a phone photo."] },
      { stage: "3. Who may already hold them", ask: ["Who did you buy from, and which lawyer acted?", "Is there a management corporation or managing agent?"], check: ["The architect's or engineer's name on any sheet."], chase: ["An answer within a week, then move to BCA."] },
      { stage: "4. Getting ready to buy", ask: ["Whose name is on the property tax bill?", "Will you apply, or shall we apply for you?"], check: ["The right authorisation form for the kind of owner.", "For HDB, the form signed by HDB."], chase: ["The signed form and the property tax statement."] },
      { stage: "5. Choosing the sets", ask: ["Please forward BCA's list before paying."], check: ["Structural sets first, and the latest A&A.", "The foundation set where load is added."], chase: ["The client's payment for the sets we ticked."] },
      { stage: "6. Checking the set", ask: ["Has anything been changed since you bought the place?"], check: ["Every floor, the details and the foundations are there.", "The sheets can be read."], chase: ["Missing sheets, by plan reference number."] },
      { stage: "7. Quoting", ask: ["May we visit to compare the plans with the building?"], check: ["The quote names the drawings it is based on.", "Anything not on the plans is listed as an assumption."], chase: ["Agreement to an investigation stage where nothing is on record."] }
    ],
    entries: terms.concat(rules, process)
  };

  window.PLANSNUM = [
    ["S$45", "", "BCA's search fee for one address", "", "BCA, Plan Purchase", "fees"],
    ["S$65", "", "For each plan reference number bought from BCA", "", "BCA, Plan Purchase", "fees"],
    ["10", "", "Working days for BCA to say what it holds", "", "BCA, Plan Purchase", "plan purchase"],
    ["4", "", "Kinds of applicant BCA accepts, each with its own form", "", "BCA, Eligibility", "who may apply"],
    ["2", "", "Kinds of plan BCA holds: building plans and structural plans", "", "BCA, Plan Purchase", "structural plan"],
    ["0", "", "Electrical and plumbing layouts in BCA's set", "", "BCA", "set contains"],
    ["S$109", "", "URA's search fee, for planning plans only", "", "URA, Buy planning records", "ura"],
    ["S$27.25", "", "A set of approved plans from URA", "", "URA, Buy planning records", "ura"],
    ["3", "", "Working days for JTC to reply, with the fee waived", "", "JTC", "jtc"],
    ["S$5", "", "An HDB flat floor plan", "", "HDB", "hdb"],
    ["1969", "", "The National Archives holds plans up to this year", "", "National Archives of Singapore", "1970"],
    ["1 week", "", "How long to wait on the free sources before buying", "", "CVC practice", "hold them"]
  ];

  window.PLANSSTATS = {
    quotes: {
      hammurabi: { pic: "draft", n: "S$45", nl: "to search one address at BCA, before any plan is bought", lead: "The approved plans exist. Someone has to ask for them", text: "BCA's Plan Purchase service covers approved building and structural plans.", paraphrase: true, by: "BCA, Plan Purchase", src: S.pps },
      fire: { pic: "mismatch", n: "10", nl: "working days for BCA to say what it holds", lead: "A plan shows what was approved, not what is there now", text: "Please use the plans only as a reference for your proposal.", paraphrase: true, by: "JTC, Request for building plans", src: S.jtc },
      thai: { pic: "extra", n: "246,000", nl: "building plans from 1884 to 1969 kept at the National Archives", lead: "A search is not a clean bill of health", text: "A legal search does not guarantee that the property does not have any unauthorised structures.", paraphrase: true, by: "BCA, building works for private properties", src: S.unauth },
      bca: { pic: "stamp", n: "4", nl: "kinds of applicant BCA accepts, each with its own form", lead: "Only the owner can open the file", text: "An authorised person needs an authorisation form signed by the registered proprietor.", paraphrase: true, by: "BCA, Eligibility and supporting documents required", src: S.elig }
    },
    tilesTitle: "What it costs and how long it takes", tilesSub: "The figures to give a client on the first call.",
    tiles: [
      { n: "S$45", label: "BCA search fee for each address", year: "current", by: "BCA", src: S.pps },
      { n: "S$65", label: "for each set, by plan reference number", year: "current", by: "BCA", src: S.pps },
      { n: "10", label: "working days for BCA's reply", year: "current", by: "BCA", src: S.pps },
      { n: "S$109", label: "URA search fee, for planning plans only", year: "current", by: "URA", src: S.ura },
      { n: "3", label: "working days for JTC, at no charge", year: "current", by: "JTC", src: S.jtc },
      { n: "1884 to 1969", label: "years of plans held at the National Archives", year: "current", by: "National Archives of Singapore", src: S.nasb }
    ],
    seriesTitle: "", seriesSub: "", series: [], timeline: [], disasters: null, db: null, systems: null
  };

  var ILL = "a typical situation, written for training. Not a real case.";
  window.PLANSCASES = [
    { stage: "The first call", tag: "Typical · The agent's layout", img: "img/case1.jpg", title: "The client sent a coloured floor plan and asked for a price", when: "Any week", where: "A resale landed house",
      story: [["draft", "A new owner wants to remove a wall between the kitchen and the dining room, and sends the plan from the property listing."], ["mismatch", "The plan has furniture and room names but no grid, no dimensions and no beams. Nobody can tell whether the wall carries the floor above."], ["check", "We ask for the property tax statement and a signed form, apply to BCA for them, and tick the structural set when BCA's list arrives."]],
      big: [["S$45", "search fee"], ["S$65", "for the structural set"], ["2 to 3 weeks", "to drawings in hand"]],
      lesson: "Say on the first call that a layout is not a drawing, and say what it will cost and how long it will take to get the real ones.", grade: ILL, src: [["BCA, Plan Purchase", S.pps]] },
    { stage: "Choosing the sets", tag: "Typical · The missing A&A", img: "img/case3.jpg", title: "The 1998 plans did not show the 2011 attic", when: "Any week", where: "A semi-detached house",
      story: [["stamp", "The owner buys the original structural plans from 1998 and sends them over."], ["extra", "On site there is an attic and a rear extension. A later owner added them in 2011 under a separate plan reference number."], ["money", "A second purchase is needed for the 2011 structural set, and the first quote has to be redone."]],
      big: [["2", "plan reference numbers needed"], ["S$65", "for the set that was missed"], ["1", "quote redone"]],
      lesson: "Ask the client to forward BCA's list before paying, and buy every structural set that touches the area of work, the latest first.", grade: ILL, src: [["BCA, Plan Purchase", S.pps]] },
    { stage: "Who may apply", tag: "Typical · The HDB wall", img: "img/case6.jpg", title: "The flat owner applied to BCA and was turned back", when: "Any week", where: "An HDB flat",
      story: [["occupy", "An owner wants a wall between two bedrooms removed and applies to BCA as the owner."], ["nostamp", "For an HDB unit BCA needs an authorisation form signed by HDB, so the application is not in order."], ["gavel", "The wall turns out to be reinforced concrete, which may not be hacked at all."]],
      big: [["S$5", "for the HDB floor plan"], ["0", "reinforced concrete walls that may be hacked"], ["1", "form, signed by HDB"]],
      lesson: "For HDB, start with HDB: the floor plan and which walls are structural. Go to BCA only with HDB's signed form.", grade: ILL, src: [["BCA, Eligibility and supporting documents required", S.elig]] }
  ];

  var BY = "CVC working practice, with the authority steps from BCA, URA, HDB and JTC.";
  window.PLANSMIST = [
    { id: "call", name: "The first call", by: BY, src: S.pps, items: [
      ["Quoting from a layout", "A brochure or agent's plan has no structure on it. Say so at once.", "draft"],
      ["Asking for drawings before knowing the works", "The works decide which drawings are needed.", "mismatch"],
      ["Not asking for the title block", "A photo of the bottom right corner tells us what the sheet is.", "check"],
      ["Not giving a time and a cost", "Two to three weeks, and about S$45 plus S$65 a set.", "clock"]] },
    { id: "id", name: "Identifying", by: BY, src: S.pps, items: [
      ["Calling an architectural plan structural", "Walls, doors and room names are architectural. Beams, columns and reinforcement are structural.", "mismatch"],
      ["The wrong unit or block", "Check the address on the title block against the client's.", "falsedoc"],
      ["An interior designer's drawings", "They show finishes and furniture, not what holds the building up.", "draft"],
      ["A draft with no approval", "Look for an approval stamp or a plan reference number.", "nostamp"]] },
    { id: "buy", name: "Buying", by: BY, src: S.elig, items: [
      ["The tenant applies", "BCA needs the registered owner or the owner's signed form.", "nostamp"],
      ["No property tax statement", "It is BCA's proof of ownership.", "nostamp"],
      ["Going to URA for structural plans", "URA sells planning plans only, and its search costs S$109.", "money"],
      ["An HDB owner applying to BCA alone", "The form must be signed by HDB.", "nostamp"],
      ["Waiting on the managing agent for a month", "Give the free sources a week.", "clock"]] },
    { id: "pick", name: "Choosing", by: BY, src: S.pps, items: [
      ["Buying only the building plans", "The structural set is the one we need.", "mismatch"],
      ["Missing the later A&A", "Each later alteration has its own plan reference number.", "extra"],
      ["No foundation set", "Needed whenever load is added.", "deepex"],
      ["Buying everything", "At S$65 a set, tick only what the job needs.", "money"],
      ["Paying before we have seen the list", "Ask the client to forward BCA's list first.", "clock"]] },
    { id: "use", name: "Using", by: BY, src: S.unauth, items: [
      ["Trusting the plans over the building", "Previous owners alter things. Walk the site with the plans.", "mismatch"],
      ["Sheets too faint to read", "Check that dimensions and reinforcement can be read before quoting.", "check"],
      ["A set with no details", "Framing plans without the schedules and sections are half a set.", "draft"],
      ["Quoting with no stated basis", "Name the drawings in the quote, and list what was assumed.", "falsedoc"]] }
  ];

  window.PLANSQUIZ = [
    ["Authorities", "Who holds the approved structural plans of a private building?", "BCA", ["URA", "SLA", "The National Archives only"], "BCA holds both the building plans and the structural plans.", "BCA, Plan Purchase"],
    ["Authorities", "What do URA's planning records show?", "Approved use, layout and floor area", ["Beam and column sizes", "Piling details", "Electrical layouts"], "They are the plans from the written permission.", "URA, Buy planning records"],
    ["Authorities", "A client's factory is in a JTC building. Where do we ask first?", "JTC", ["URA", "SCDF", "HDB"], "A reply comes in 3 working days and the fee is waived.", "JTC, Request for building plans"],
    ["Fees", "What is BCA's search fee?", "S$45 for each address", ["S$22", "S$35", "S$109"], "Older pages show S$35. BCA's live page says S$45.", "BCA, Plan Purchase"],
    ["Fees", "What does BCA charge for each set?", "S$65 for each plan reference number", ["S$4 a sheet", "S$27.25", "S$45"], "Paid after the plans are chosen.", "BCA, Plan Purchase"],
    ["Fees", "What is URA's search fee?", "S$109", ["S$27.25", "S$45", "S$54.50"], "S$54.50 is URA's legal requisition, a different service.", "URA, Buy planning records"],
    ["Process", "How long does BCA take to say what it holds?", "Within 10 working days", ["The same day", "3 working days", "One month"], "", "BCA, Plan Purchase"],
    ["Process", "What does BCA use as proof of ownership?", "The current property tax statement", ["A utility bill", "The tenancy agreement", "The sale brochure"], "It shows the owner's name and the address.", "BCA, Eligibility"],
    ["Process", "A company owns the property. What extra does BCA need?", "Its authorisation on letterhead and its BizFile", ["Nothing more", "A statutory declaration", "The director's passport"], "", "BCA, Eligibility"],
    ["Process", "Can an HDB flat owner apply to BCA as the owner?", "No, the form must be signed by HDB", ["Yes, with Singpass", "Yes, with the lease", "Only for resale flats"], "", "BCA, Eligibility"],
    ["Drawings", "Which sheet shows the beams and columns of one floor?", "The framing plan", ["The floor plan", "The elevation", "The strata plan"], "A floor plan is architectural.", "CVC practice"],
    ["Drawings", "A coloured plan with furniture and no dimensions is most likely what?", "A sales brochure or agent's layout", ["A structural plan", "A record plan", "A piling plan"], "We cannot quote from it.", "CVC practice"],
    ["Drawings", "The client wants a mezzanine. Which set is most often forgotten?", "The foundation or piling plan", ["The elevations", "The roof plan", "The landscape plan"], "Added load goes to the ground.", "CVC practice"],
    ["Drawings", "Where on a sheet do we look first?", "The title block", ["The north point", "The legend", "The key plan"], "It gives the address, the drawing title, the number and the date.", "CVC practice"],
    ["Drawings", "Does BCA's set include electrical and plumbing layouts?", "No", ["Yes, always", "Yes, for houses", "Only on request"], "", "BCA"],
    ["Practice", "BCA sold the plans, so they match the building. True?", "No, check them against the site", ["Yes, always", "Yes, if stamped", "Yes, after 1989"], "Owners alter buildings, sometimes without approval.", "BCA, building works for private properties"],
    ["Practice", "What should the client do with BCA's list before paying?", "Forward it to us so we can tick the sets", ["Buy every set", "Buy the first one", "Buy the cheapest"], "", "CVC practice"],
    ["Practice", "Nothing is on record anywhere. What then?", "A measured survey and a structural investigation", ["Quote from photos", "Use the neighbour's plans", "Decline the job"], "Quote it as a separate first stage.", "CVC practice"]
  ];
})();
