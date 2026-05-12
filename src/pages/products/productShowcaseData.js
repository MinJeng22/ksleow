const retailImage = "/uploads/products/autocount-pos-showcase.png";
const hrmsImage = "/uploads/products/autocount-hrms-showcase.png";
const feedmeImage = "/uploads/products/feedme-pos-showcase.png";

export const autoCountPOSData = {
  name: "AutoCount POS",
  eyebrow: "Retail POS System",
  logo: "/uploads/products/autocountpos.png",
  heroImage: retailImage,
  heroImageAlt: "AutoCount POS retail interface",
  iconBg: "#ffffff",
  hero:
    "A retail POS platform for businesses that need fast checkout, accurate stock movement, and tighter outlet control. It connects front-counter transactions with inventory and accounting discipline, so owners can manage pricing, stock, cashier activity, and sales reporting without relying on after-the-fact spreadsheets.",
  sidebar: [
    { id: "overview", label: "Overview" },
    { id: "fit", label: "Best Fit" },
    { id: "checkout", label: "Checkout" },
    { id: "inventory", label: "Inventory" },
    { id: "control", label: "Control" },
    { id: "implementation", label: "Implementation" },
  ],
  fitLabel: "Best Fit",
  fitTitle: "Built for retailers where every sale changes stock",
  fitBody:
    "AutoCount POS is strongest when the checkout counter, stockroom, and back office must stay aligned. It suits retailers, mini markets, hardware stores, wholesalers with showrooms, and multi-outlet operators that need visibility without adding manual reconciliation work.",
  fitCards: [
    {
      title: "High-volume retail checkout",
      body:
        "Support barcode-driven billing, cashier workflows, multiple payment methods, returns, and daily closing routines that staff can repeat consistently.",
    },
    {
      title: "Inventory-led businesses",
      body:
        "Keep selling, stock availability, pricing, purchasing, and item history in one operating rhythm, especially where stock accuracy affects margin.",
    },
    {
      title: "Multi-outlet operators",
      body:
        "Give management better control over outlet transactions, cashier accountability, branch performance, and synchronized reporting.",
    },
  ],
  sections: [
    {
      kicker: { id: "checkout", label: "Retail Operations" },
      title: "Checkout workflows that match real retail pressure",
      body:
        "A good POS should not slow down the counter. AutoCount POS gives stores a structured front-end workflow for billing, payment, receipts, promotions, and daily closing, while preserving the controls management needs behind the scenes.",
      points: [
        "Barcode, item, price, and payment workflows help reduce key-in errors during peak hours.",
        "Promotion, voucher, and member-related controls can support campaign-driven retail operations.",
        "Cashier shifts, daily closing, and payment categorization make end-of-day review easier to audit.",
        "Offline protection keeps outlets operating when connectivity drops, then synchronizes once the connection returns.",
      ],
      image: retailImage,
      imageAlt: "AutoCount POS checkout workflow",
    },
    {
      kicker: { id: "inventory", label: "Stock Discipline" },
      title: "Inventory visibility from counter to back office",
      body:
        "For stock-heavy businesses, POS data must do more than print receipts. AutoCount POS supports inventory control, stock availability, replenishment, costing, pricing, multi-location movement, and item-level reporting so purchasing decisions are based on operating data rather than guesswork.",
      points: [
        "Sales activity can update stock movement for cleaner item availability and replenishment planning.",
        "Multi-location and branch stock visibility help managers respond faster to shortages and slow-moving items.",
        "Item controls such as barcode, multi-UOM, batches, serial numbers, and backorder controls support more complex inventory models.",
        "Sales and purchase modules can sit closer to POS activity, reducing the gap between store operations and accounting records.",
      ],
      image: retailImage,
      imageAlt: "AutoCount POS inventory and reporting",
    },
    {
      kicker: { id: "control", label: "Management Control" },
      title: "Cleaner reporting for owners, finance, and branch managers",
      body:
        "AutoCount POS is built to connect retail activity with AutoCount Accounting, allowing outlet transactions to be posted with better control over dates, outlets, payment methods, taxes, vouchers, deposits, service charges, and rounding adjustments.",
      points: [
        "Integrated posting to AutoCount Accounting helps reduce third-party data integrity issues.",
        "Outlet sales reports and dashboard views give owners faster insight into daily performance.",
        "Custom reports, user-defined fields, layouts, and plugins allow the system to reflect operational differences.",
        "SST and LHDN e-Invoice readiness help retail and F&B operators keep compliance work closer to daily transactions.",
      ],
      image: retailImage,
      imageAlt: "AutoCount POS management reporting",
    },
  ],
  implementationTitle: "Implementation should start with control points, not only hardware",
  implementationBody:
    "A POS rollout works best when product data, pricing rules, outlet processes, cashier permissions, and accounting posting logic are defined before go-live. K.S. Leow Group helps configure the system around daily operations instead of treating POS as a simple terminal installation.",
  implementationPanels: [
    {
      title: "Setup focus",
      bullets: [
        "Product master, barcode, category, pricing, tax, and payment method structure.",
        "Outlet, cashier, role permission, receipt, printer, scanner, and terminal configuration.",
        "Promotion, voucher, membership, daily closing, and accounting posting workflow review.",
      ],
    },
    {
      title: "K.S. Leow Group support",
      bullets: [
        "Requirement mapping for retail, showroom, chain store, and stock-heavy operators.",
        "Training for cashier, supervisor, finance, and management users.",
        "Post-live support for reporting, stock adjustment, posting, and process refinement.",
      ],
    },
  ],
  ctaKicker: "Retail System Consultation",
  ctaTitle: "Plan a POS setup that your outlets can actually operate",
  ctaBody:
    "Share your outlet count, stock complexity, payment methods, and reporting needs. We will recommend a practical AutoCount POS setup and implementation path.",
};

export const autoCountHRMSData = {
  name: "AutoCount HRMS",
  eyebrow: "Cloud HR and Payroll System",
  logo: "/uploads/products/hrms-logo-2024_white-1024x288.png",
  heroImage: hrmsImage,
  heroImageAlt: "AutoCount HRMS dashboard",
  iconBg: "#2f315a",
  hero:
    "A cloud HRMS for Malaysian businesses that need payroll accuracy, employee self-service, leave and claim control, and attendance data in one place. It reduces repetitive HR administration while keeping statutory payroll work structured, traceable, and easier to review.",
  sidebar: [
    { id: "overview", label: "Overview" },
    { id: "fit", label: "Best Fit" },
    { id: "payroll", label: "Payroll" },
    { id: "self-service", label: "Self-Service" },
    { id: "attendance", label: "Attendance" },
    { id: "implementation", label: "Implementation" },
  ],
  fitLabel: "Best Fit",
  fitTitle: "Built for teams that have outgrown spreadsheet HR",
  fitBody:
    "AutoCount HRMS fits companies that need payroll to be consistent, HR approvals to be visible, and employee records to be managed without long email threads. It is especially useful for multi-department, multi-branch, shift-based, or growing teams.",
  fitCards: [
    {
      title: "SMEs with statutory payroll needs",
      body:
        "Manage payroll processes with Malaysian statutory components, recurring pay items, variable claims, payslips, and management review points.",
    },
    {
      title: "Teams with approval-heavy HR",
      body:
        "Move leave, claims, documents, balances, and approvals into a clearer employee self-service workflow.",
    },
    {
      title: "Branch and shift operations",
      body:
        "Use attendance, roster, clocking, and overtime data to support payroll decisions with less manual consolidation.",
    },
  ],
  sections: [
    {
      kicker: { id: "payroll", label: "Payroll Accuracy" },
      title: "Payroll work that is easier to control and review",
      body:
        "Payroll mistakes are expensive because they affect employees, compliance, and trust. AutoCount HRMS gives HR and finance teams a structured environment for payroll processing, statutory setup, payslips, allowances, deductions, overtime, and reporting.",
      points: [
        "Supports statutory payroll components such as EPF, SOCSO, EIS, income tax, Zakat, Tabung Haji, and ASN where applicable.",
        "Payroll process types can cover regular salary cycles, bonus, commission, claim, and other recurring or variable pay scenarios.",
        "Payslip delivery, email notification, report design, electronic payment, and loan repayment workflows help reduce manual payroll handling.",
        "Payroll posting can connect to AutoCount Cloud Accounting for companies that want HR and finance data to flow more cleanly.",
      ],
      image: hrmsImage,
      imageAlt: "AutoCount HRMS payroll processing",
    },
    {
      kicker: { id: "self-service", label: "Employee Self-Service" },
      title: "Fewer HR interruptions, clearer employee visibility",
      body:
        "AutoCount HRMS gives employees and managers access to the routine HR actions that usually create back-and-forth messages: payslip viewing, EA forms, leave balance checking, leave requests, claim submissions, attachments, and approval status.",
      points: [
        "Employees can access essential features through web portal and mobile app.",
        "Leave and claim applications can be submitted and approved digitally, with attachment support for supporting documents.",
        "Multi-level approval, entitlement groups, company calendar, and historical reports help management keep decisions traceable.",
        "Employee profile attachments, HR letters, shared folders, announcements, and reminders centralize HR records beyond payroll only.",
      ],
      image: hrmsImage,
      imageAlt: "AutoCount HRMS employee self-service",
    },
    {
      kicker: { id: "attendance", label: "Attendance and Workforce Data" },
      title: "Attendance data that can support payroll decisions",
      body:
        "Attendance is not useful if it remains separate from payroll. AutoCount HRMS eAttendance supports flexible clocking, verification, reports, roster and shift setup, and synchronization into payroll for wages and overtime calculation.",
      points: [
        "Clocking options can include geolocation, WiFi, Bluetooth, facial recognition, mobile app, and iFace biometric device workflows.",
        "HR can verify and amend attendance transactions, view maps for geolocation clock-ins, and generate attendance or overtime reports.",
        "Flexible shift and roster setup supports both fixed-hour employees and teams with changing work schedules.",
        "Attendance data can be synchronized into payroll, reducing the risk of separate manual wage or overtime calculations.",
      ],
      image: hrmsImage,
      imageAlt: "AutoCount HRMS attendance management",
    },
  ],
  implementationTitle: "HRMS rollout needs clean data and clear approval rules",
  implementationBody:
    "The value of HRMS depends on the setup behind it: employee records, departments, calendars, pay items, approval paths, attendance rules, and statutory settings. K.S. Leow Group helps structure these decisions before migration so the system supports how your company actually pays and manages people.",
  implementationPanels: [
    {
      title: "Setup focus",
      bullets: [
        "Employee master data, company structure, departments, branches, calendars, and approval levels.",
        "Allowance, deduction, overtime, claim, leave, statutory, and payslip settings.",
        "Attendance devices, mobile clocking rules, roster logic, and payroll synchronization.",
      ],
    },
    {
      title: "K.S. Leow Group support",
      bullets: [
        "Payroll and HR requirement review before subscription and migration.",
        "Configuration, administrator training, and employee self-service onboarding.",
        "Support for month-end payroll review, reports, and process adjustment after go-live.",
      ],
    },
  ],
  ctaKicker: "HRMS Consultation",
  ctaTitle: "Move HR admin into a system your team can trust",
  ctaBody:
    "Tell us your headcount, payroll cycle, attendance method, and approval structure. We will help you map the right AutoCount HRMS setup.",
};

export const feedMePOSData = {
  name: "FeedMe POS",
  eyebrow: "Restaurant and F&B POS System",
  logo: "/uploads/products/feedme.png",
  heroImage: feedmeImage,
  heroImageAlt: "FeedMe POS restaurant interface",
  iconBg: "#ffffff",
  hero:
    "A cloud F&B POS for restaurants, cafes, and multi-station kitchens where orders must move quickly from customer to kitchen to payment. It helps teams manage tables, menus, QR ordering, kitchen displays, delivery channels, promotions, and sales visibility from one operating platform.",
  sidebar: [
    { id: "overview", label: "Overview" },
    { id: "fit", label: "Best Fit" },
    { id: "ordering", label: "Ordering" },
    { id: "kitchen", label: "Kitchen" },
    { id: "growth", label: "Growth" },
    { id: "implementation", label: "Implementation" },
  ],
  fitLabel: "Best Fit",
  fitTitle: "Built for F&B teams where speed and order accuracy affect profit",
  fitBody:
    "FeedMe POS is designed for operators who need the front of house, kitchen, delivery, and management office to see the same operational truth. It fits table-service restaurants, quick-service cafes, dessert shops, food kiosks, cloud kitchens, and growing F&B brands.",
  fitCards: [
    {
      title: "Table-service restaurants",
      body:
        "Manage floor plans, table flow, orders, bills, and kitchen communication without losing visibility during busy service.",
    },
    {
      title: "Quick-service and cafes",
      body:
        "Speed up counter ordering, queue flow, QR ordering, digital menus, pickup, and integrated payment workflows.",
    },
    {
      title: "Multi-outlet F&B brands",
      body:
        "Centralize menu, promotion, sales, staff roles, reporting, and outlet management as operations expand.",
    },
  ],
  sections: [
    {
      kicker: { id: "ordering", label: "Guest and Counter Ordering" },
      title: "A smoother ordering flow across dine-in, takeaway, and QR",
      body:
        "FeedMe POS gives F&B operators multiple order channels without forcing the team to manage disconnected systems. Staff can handle counter and table orders, while customers can use QR ordering, digital menus, kiosk, pickup, delivery, and flexible payment options where configured.",
      points: [
        "Table management helps restaurants design floor plans and improve seating flow.",
        "QR Code Ordering supports contactless ordering with flexible payment options.",
        "Digital menus reduce printing dependency and make menu updates easier to publish.",
        "Sub POS and kiosk workflows can add more ordering points during high-traffic periods.",
      ],
      image: feedmeImage,
      imageAlt: "FeedMe POS ordering workflow",
    },
    {
      kicker: { id: "kitchen", label: "Kitchen Coordination" },
      title: "Keep kitchen communication visible and accountable",
      body:
        "The kitchen should not depend on verbal memory when the restaurant is busy. FeedMe POS includes Kitchen Display System and Order Display System capabilities that help production teams see order flow and help customers or delivery riders track status more clearly.",
      points: [
        "Kitchen Display System digitizes kitchen orders and improves kitchen communication.",
        "Order Display System keeps customers and delivery drivers updated on order status.",
        "Delivery platform integration can synchronize delivery orders and menu updates.",
        "Inventory tracking helps operators monitor stock availability and reduce shortages or overstocking.",
      ],
      image: feedmeImage,
      imageAlt: "FeedMe POS kitchen display workflow",
    },
    {
      kicker: { id: "growth", label: "Sales and Management" },
      title: "Use POS data to improve sales, menu decisions, and outlet control",
      body:
        "FeedMe POS is not only a billing tool. It supports centralized outlet management, real-time sales reporting, scheduled reporting, promotions, loyalty, CRM, menu creation, role management, and accounting integration so management can make decisions with operating data.",
      points: [
        "FeedMe Portal centralizes menu, promotion, sales, CRM, and outlet management.",
        "Real-time sales reporting and scheduled reporting help owners track performance without waiting for manual summaries.",
        "Promotions, loyalty programs, member tiers, SMS broadcasts, and menu tools support repeat purchase strategy.",
        "Role management and punch card features give managers better visibility into staff responsibilities and attendance.",
      ],
      image: feedmeImage,
      imageAlt: "FeedMe POS reporting and growth tools",
    },
  ],
  implementationTitle: "F&B POS setup should be designed around service flow",
  implementationBody:
    "Restaurant POS succeeds when menus, modifiers, printer routing, kitchen stations, table plans, payments, delivery channels, and outlet reporting are mapped properly. K.S. Leow Group helps operators define those workflows before training the team.",
  implementationPanels: [
    {
      title: "Setup focus",
      bullets: [
        "Menu categories, modifiers, pricing, taxes, service charge, receipts, and payment methods.",
        "Table layout, QR ordering flow, KDS or printer routing, pickup, delivery, and queue process.",
        "Outlet permissions, staff roles, daily closing, reporting, promotion, loyalty, and accounting integration.",
      ],
    },
    {
      title: "K.S. Leow Group support",
      bullets: [
        "Operational workflow mapping for restaurants, cafes, kiosks, and multi-outlet F&B brands.",
        "Hardware, device, counter, kitchen, and management training before go-live.",
        "Post-live support for menu changes, reporting, outlet control, and service flow refinement.",
      ],
    },
  ],
  ctaKicker: "F&B POS Consultation",
  ctaTitle: "Design a POS workflow around how your restaurant serves",
  ctaBody:
    "Tell us your outlet type, table count, menu complexity, kitchen stations, payment methods, and delivery channels. We will recommend a FeedMe POS setup that fits daily service.",
};
