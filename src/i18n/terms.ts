/**
 * Unified glossary and translation terms for Honey Chain.
 * Ensures consistent Hindi and English terminology across every corner and section of the application.
 */

export const STATUS_TRANSLATIONS: Record<string, string> = {
  // Laboratory testing statuses
  "Awaiting Analysis": "विश्लेषण प्रतीक्षित",
  "Awaiting Sample / Analysis": "नमूना / विश्लेषण प्रतीक्षित",
  "In Analysis": "विश्लेषण जारी",
  "Under Analysis": "विश्लेषण जारी",
  "Approved": "स्वीकृत",
  "Quality Approved": "गुणवत्ता स्वीकृत",
  "Rejected": "अस्वीकृत",
  "Correction Required": "सुधार आवश्यक",
  "Rejected / Correction": "अस्वीकृत / सुधार आवश्यक",
  "Eligible": "पात्र",
  "Not Eligible": "अपात्र",

  // Hive health statuses
  "healthy": "स्वस्थ",
  "Healthy": "स्वस्थ",
  "Active & Laying": "सक्रिय और अंडा देने वाली",
  "Laying": "अंडा देने वाली",
  "active": "सक्रिय",
  "Active": "सक्रिय",
  "warning": "चेतावनी",
  "Warning": "चेतावनी",
  "quarantine": "क्वारंटाइन",
  "Quarantine": "क्वारंटाइन",
  "critical": "गंभीर",
  "Critical": "गंभीर",
  "inactive": "निष्क्रिय",
  "Inactive": "निष्क्रिय",
  "queenless": "रानी विहीन",
  "Queenless": "रानी विहीन",
  "Virgin": "वर्जिन रानी",
  "Monitoring": "निगरानी में",
  "monitoring": "निगरानी में",
  "supersedure": "प्रतिस्थापन (सुपरसीड्योर)",
  "Supersedure": "प्रतिस्थापन",
  "requeening needed": "नई रानी आवश्यक",
  "Requeening Needed": "नई रानी आवश्यक",

  // Batch statuses
  "Harvested": "कटाई पूर्ण",
  "harvested": "कटाई पूर्ण",
  "Raw": "कच्चा शहद",
  "Raw Honey": "कच्चा शहद",
  "Processed": "प्रसंस्कृत",
  "Processed Honey": "प्रसंस्कृत शहद",
  "Blended": "मिश्रित",
  "Filtered": "फ़िल्टर किया हुआ",
  "Bottled": "बोतलबंद",
  "Ready": "तैयार",
  "ready": "तैयार",

  // Custody & Logistics
  "In Transit": "परिवहन में",
  "in_transit": "परिवहन में",
  "Transferred": "हस्तांतरित",
  "transferred": "हस्तांतरित",
  "Completed": "पूर्ण",
  "completed": "पूर्ण",
  "Pending": "लंबित",
  "pending": "लंबित",
  "Pending Review": "समीक्षा लंबित",
  "pending_review": "समीक्षा लंबित",
  "Verified": "सत्यापित",
  "verified": "सत्यापित",
  "Confirmed": "पुष्टि की गई",
  "Received": "प्राप्त हुआ",
  "Accepted": "स्वीकृत",
  "accepted": "स्वीकृत",
  "Disputed": "विवादित",
  "Fulfilled": "पूर्ण",
  "fulfilled": "पूर्ण",
  "Cancelled": "रद्द",
  "cancelled": "रद्द",
  "Suspended": "निलंबित",
  "suspended": "निलंबित",
  "Disabled": "अक्षम",

  // Marketplace & serialization
  "Available": "उपलब्ध",
  "In Stock": "स्टॉक में",
  "Out of Stock": "स्टॉक समाप्त",
  "Low Stock": "कम स्टॉक",
  "Listed": "सूचीबद्ध",
  "Sold": "बिक चुका",
  "Sold Out": "बिक चुका",
  "Draft": "ड्राफ्ट",
  "Draft Lot": "ड्राफ्ट लॉट",
  "Reserved": "आरक्षित",
  "Expired": "समाप्त",
  "Order Placed": "ऑर्डर प्राप्त",
  "Shipped": "भेज दिया गया",
  "Delivered": "वितरित",

  // Admin & Exceptions
  "Investigating": "जांच जारी",
  "investigating": "जांच जारी",
  "Open": "खुला / सक्रिय",
  "open": "खुला / सक्रिय",
  "Resolved": "समाधानित",
  "resolved": "समाधानित",
  "Dismissed": "खारिज",
  "dismissed": "खारिज",
  "Flagged": "चिह्नित",
  "flagged": "चिह्नित",
  "Flagged Anomaly": "विसंगति चिह्नित",
  "Corrected": "सुधारा गया",
  "corrected": "सुधारा गया",
  "Low Severity": "निम्न गंभीरता",
  "low": "निम्न",
  "Low": "निम्न",
  "Medium": "मध्यम",
  "medium": "मध्यम",
  "High Severity": "उच्च गंभीरता",
  "high": "उच्च",
  "High": "उच्च",
  "CRITICAL": "अति गंभीर",
  "Critical Severity": "अति गंभीर",

  // Plausibility
  "Plausible": "विश्वसनीय (उचित)",
  "Discrepancy": "विसंगति",
  "High Risk": "उच्च जोखिम",
  "Warning / Anomaly": "चेतावनी / विसंगति",
};

export const ROLE_TRANSLATIONS: Record<string, string> = {
  "Super Administrator": "सुपर प्रशासक",
  "Super Admin": "सुपर प्रशासक",
  "Organization Admin": "संगठन प्रशासक",
  "Organisation Admin": "संगठन प्रशासक",
  "Beekeeper": "मधुमक्खी पालक",
  "Collector / Field Agent": "संग्रहकर्ता / फील्ड एजेंट",
  "Apiary Master": "मधुमक्खी फार्म प्रमुख",
  "Processor": "प्रसंस्करणकर्ता",
  "Lab Technician / Analyst": "लैब तकनीशियन / विश्लेषक",
  "Lab Technician": "लैब तकनीशियन",
  "Regulator / Auditor": "नियामक / ऑडिटर",
  "Regulatory Officer": "नियामक अधिकारी",
  "Packager": "पैकेजिंग ऑपरेटर",
  "Distributor": "वितरक",
  "Retailer": "खुदरा विक्रेता",
  "Consumer": "उपभोक्ता",
  "Buyer": "खरीदार",
  "Lead Beekeeper": "प्रमुख मधुमक्खी पालक",
  "super_admin": "सुपर प्रशासक",
  "org_admin": "संगठन प्रशासक",
  "beekeeper": "मधुमक्खी पालक",
  "collector": "संग्रहकर्ता",
  "processor": "प्रसंस्करणकर्ता",
  "lab_technician": "लैब तकनीशियन",
  "regulator_auditor": "नियामक / ऑडिटर",
  "packager": "पैकेजिंग ऑपरेटर",
  "distributor": "वितरक",
  "retailer": "खुदरा विक्रेता",
  "consumer": "उपभोक्ता",
  "buyer": "खरीदार",
};

export const ORG_TYPE_TRANSLATIONS: Record<string, string> = {
  "Beekeeper Cooperative": "मधुमक्खी पालन सहकारी समिति",
  "Honey Processing Plant": "शहद प्रसंस्करण संयंत्र",
  "Testing Laboratory": "परीक्षण प्रयोगशाला",
  "Retail & Distribution": "खुदरा एवं वितरण",
  "Government Regulatory Agency": "सरकारी नियामक संस्था",
  "Enterprise Organization": "उद्यम संगठन",
  "Cooperative": "सहकारी समिति",
  "Manufacturer": "निर्माता / प्रसंस्करण संयंत्र",
  "Laboratory": "प्रयोगशाला",
  "Buyer": "खरीदार",
  "Distributor": "वितरक",
  "Regulatory Body": "नियामक प्राधिकरण",
  "Statutory Authority": "वैधानिक प्राधिकरण",
};

export const NAV_TRANSLATIONS: Record<string, string> = {
  // Groups
  "Main": "मुख्य",
  "Dashboard": "डैशबोर्ड",
  "Management": "प्रबंधन",
  "Operations & Quality": "संचालन एवं गुणवत्ता",
  "Quality & Testing": "गुणवत्ता एवं परीक्षण",
  "Product & Market": "उत्पाद एवं बाज़ार",
  "Commercial": "व्यावसायिक",
  "System & Governance": "सिस्टम एवं प्रशासन",
  "Administration": "प्रशासन एवं निगरानी",

  // Items
  "Hives & Apiaries": "छत्ते और मधुमक्खी फार्म",
  "Colony Activities": "कॉलोनी गतिविधियाँ",
  "Honey Batches": "शहद के बैच",
  "Custody Transfers": "कस्टडी ट्रांसफर",
  "Receiving": "आवक रसीद",
  "Processing & Blending": "प्रसंस्करण एवं मिश्रण",
  "Lab Testing": "प्रयोगशाला परीक्षण",
  "Laboratory Testing": "प्रयोगशाला परीक्षण",
  "Certifications": "गुणवत्ता प्रमाणपत्र",
  "Bottles & QR": "बोतलें और क्यूआर कोड",
  "Bottles & QR Verification": "बोतलें और क्यूआर सत्यापन",
  "Marketplace": "बाज़ार (मार्केटप्लेस)",
  "Marketplace Orders": "मार्केटप्लेस ऑर्डर",
  "Orders": "ऑर्डर",
  "Admin Overview": "प्रशासन अवलोकन",
  "Organisations": "संगठन",
  "Users & Roles": "उपयोगकर्ता एवं भूमिकाएं",
  "Audit History": "ऑडिट इतिहास",
  "Audit Log": "ऑडिट लॉग",
  "Exceptions": "अपवाद",
  "System Alerts": "सिस्टम अलर्ट",
  "Access Requests": "एक्सेस अनुरोध",
  "Field vs Sales Plausibility": "उत्पादन बनाम बिक्री विश्लेषण",
  "Honey Chain": "हनी चेन",
  "Traceability": "ट्रेसेबिलिटी",
  "Register Apiary": "केंद्र पंजीकृत करें",
  "Capture Activity": "गतिविधि दर्ज करें",
  "Create Harvest Batch": "कटाई बैच बनाएं",
  "New Transfer": "नया ट्रांसफर",
  "Intake Review": "आवक समीक्षा",
  "New Processing Run": "नया प्रसंस्करण रन",
  "Submit Sample for Testing": "परीक्षण के लिए नमूना जमा करें",
  "Create Bottles": "बोतलें बनाएं",
  "Bottle Detail": "बोतल विवरण",
  "Batch Detail": "बैच विवरण",
  "Transfer Detail": "ट्रांसफर विवरण",
  "Hive Detail": "छत्ता विवरण",
  "Certificate Details": "प्रमाणपत्र विवरण",
  "Certificates of Analysis": "विश्लेषण प्रमाणपत्र",
  "All Orders": "सभी ऑर्डर",
  "Commercial Purchase Ledger": "वाणिज्यिक खरीद बहीखाता",
};


export const EVENT_TYPE_TRANSLATIONS: Record<string, string> = {
  "Administrative Action": "प्रशासनिक कार्रवाई",
  "Access Request": "एक्सेस अनुरोध",
  "Apiary Registered": "मधुमक्खी फार्म पंजीकृत",
  "Hive Registered": "छत्ता पंजीकृत",
  "Activity Recorded": "गतिविधि दर्ज",
  "Harvest Batch Created": "कटाई बैच निर्मित",
  "Custody Dispatched": "कस्टडी प्रेषित",
  "Receiving Logged": "आवक दर्ज",
  "Processing Completed": "प्रसंस्करण पूर्ण",
  "Lab Test Approved": "लैब परीक्षण स्वीकृत",
  "Bottle Serialized": "बोतल क्रमबद्ध",
  "Order Created": "ऑर्डर निर्मित",
  "Order Accepted": "ऑर्डर स्वीकृत",
  "Order Dispatched": "ऑर्डर प्रेषित",
};

export const COMMON_TRANSLATIONS: Record<string, string> = {
  // Actions
  "Submit": "जमा करें",
  "Save": "सहेजें",
  "Cancel": "रद्द करें",
  "Back": "वापस",
  "Delete": "हटाएं",
  "Edit": "संपादित करें",
  "View": "देखें",
  "View Details": "विवरण देखें",
  "Search": "खोजें",
  "Filter": "फ़िल्टर",
  "Reset": "रीसेट",
  "Clear": "साफ़ करें",
  "Clear Filters": "फ़िल्टर साफ़ करें",
  "Export": "निर्यात करें",
  "Download": "डाउनलोड करें",
  "Print": "प्रिंट करें",
  "Refresh": "रिफ्रेश करें",
  "Create": "बनाएं",
  "Add": "जोड़ें",
  "Close": "बंद करें",
  "Actions": "कार्रवाई",
  "Audit": "ऑडिट",
  "Review": "समीक्षा",
  "Cert": "प्रमाणपत्र",
  "Details": "विवरण",
  "Confirm": "पुष्टि करें",
  "Approve": "स्वीकृत करें",
  "Reject": "अस्वीकृत करें",
  "Suspend": "निलंबित करें",
  "Inspect": "निरीक्षण करें",
  "Assign Role": "भूमिका सौंपें",
  "Investigate": "जांच करें",
  "View Order": "ऑर्डर देखें",
  "Browse Marketplace": "मार्केटप्लेस देखें",
  "All": "सभी",
  "All Statuses": "सभी स्थितियां",
  "All Panels": "सभी पैनल",
  "All Types": "सभी प्रकार",
  "All Severities": "सभी गंभीरता स्तर",
  "All Organisations": "सभी संगठन",
  "All Roles": "सभी भूमिकाएं",

  // Common Headers & Labels
  "Status": "स्थिति",
  "Date": "दिनांक",
  "Weight": "वजन / भार",
  "Batch": "बैच",
  "Batch ID": "बैच आईडी",
  "Batch Number": "बैच नंबर",
  "Hive": "छत्ता",
  "Apiary": "मधुमक्खी फार्म",
  "Certificate": "प्रमाणपत्र",
  "Report": "रिपोर्ट",
  "Notes": "टिप्पणी",
  "Location": "स्थान",
  "Type": "प्रकार",
  "Flora": "पुष्प स्रोत",
  "Floral Origin": "पुष्प स्रोत",
  "Moisture": "नमी",
  "Analyst": "विश्लेषक",
  "Active Session Role:": "सक्रिय सत्र भूमिका:",
  "Switch Active Role:": "भूमिका बदलें:",
  "Active Organisation": "सक्रिय संगठन",
  "Change": "बदलें",
  "Change...": "बदलें...",
  "Sign out": "साइन आउट",
  "Sign In": "साइन इन",
};

/**
 * Returns translated string if in Hindi mode and translation exists.
 */
export function translateTerm(term: string, isHindi: boolean): string {
  if (!isHindi || !term) return term;
  return (
    STATUS_TRANSLATIONS[term] ||
    STATUS_TRANSLATIONS[term.trim()] ||
    ROLE_TRANSLATIONS[term] ||
    ROLE_TRANSLATIONS[term.trim()] ||
    ORG_TYPE_TRANSLATIONS[term] ||
    ORG_TYPE_TRANSLATIONS[term.trim()] ||
    NAV_TRANSLATIONS[term] ||
    NAV_TRANSLATIONS[term.trim()] ||
    EVENT_TYPE_TRANSLATIONS[term] ||
    EVENT_TYPE_TRANSLATIONS[term.trim()] ||
    COMMON_TRANSLATIONS[term] ||
    COMMON_TRANSLATIONS[term.trim()] ||
    term
  );
}

export function translateStatus(status: string, isHindi: boolean): string {
  if (!isHindi || !status) return status;
  return STATUS_TRANSLATIONS[status] || STATUS_TRANSLATIONS[status.trim()] || status;
}

export function translateRole(role: string, isHindi: boolean): string {
  if (!isHindi || !role) return role;
  return ROLE_TRANSLATIONS[role] || ROLE_TRANSLATIONS[role.trim()] || role;
}

export function translateOrgType(orgType: string, isHindi: boolean): string {
  if (!isHindi || !orgType) return orgType;
  return ORG_TYPE_TRANSLATIONS[orgType] || ORG_TYPE_TRANSLATIONS[orgType.trim()] || orgType;
}

export function translateNav(nav: string, isHindi: boolean): string {
  if (!isHindi || !nav) return nav;
  return NAV_TRANSLATIONS[nav] || NAV_TRANSLATIONS[nav.trim()] || nav;
}

export function translateEventType(eventType: string, isHindi: boolean): string {
  if (!isHindi || !eventType) return eventType;
  return EVENT_TYPE_TRANSLATIONS[eventType] || EVENT_TYPE_TRANSLATIONS[eventType.trim()] || eventType;
}
