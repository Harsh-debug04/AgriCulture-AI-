export const translations = {
  en: {
    guest: "Guest",
    header: {
      title: "AgriCart Assistant",
      status: "Online · Model v3.5",
    },
    nav: {
      chatAssistant: "Chat Assistant",
      marketData: "Market Data",
      weather: "Weather",
      cropInfo: "Crop Info",
      pestDiagnosis: "Pest Diagnosis",
      news: "News",
    },
    marketWatch: {
      title: "Market Watch",
      addCrop: "Add Crop",
    },
    agriNews: {
      title: "Agri News",
      readMore: "Read more...",
    },
    chat: {
      initialMessage: "Namaste! How can I assist you with your farming needs today?",
      placeholder: "Type your message...",
      disclaimer: "Agro Track Ai can make mistakes. Consider checking important information.",
    },
    marketDataPage: {
      title: "Commodity Prices",
      description: "Real-time prices from various mandis across India.",
      searchPlaceholder: "Search for a commodity...",
      searchButton: "Search",
      table: {
        commodity: "Commodity",
        market: "Market (Mandi)",
        price: "Price (per quintal)",
      },
      error: "Failed to load market data.",
      searchError: "Failed to search for commodity.",
    },
    weatherPage: {
        title: "Weather Forecast",
        description: "Current conditions and 7-day forecast.",
        searchPlaceholder: "Enter a location...",
        searchButton: "Search",
        current: {
            wind: "Wind",
            humidity: "Humidity",
        },
        forecast: "7-Day Forecast",
        error: "Failed to load weather for",
        loadError: "Could not load weather forecast. Please try a different location."
    },
    cropInfoPage: {
        searchPlaceholder: "Search for a crop...",
        backButton: "Back to Crop List",
        loadingError: "Failed to load crop information.",
        detailsError: "Failed to load details for",
        cultivation: "Cultivation Details",
        pestManagement: "Pest and Disease Management",
        postHarvest: "Post-Harvest and Market Information",
        couldNotLoad: "Could not load details for"
    },
    pestDiagnosisPage: {
        title: "Submit for Diagnosis",
        description: "Upload a photo of the affected plant and describe the issue.",
        uploadPrompt: "Click to upload an image",
        usePlaceholder: "or use our placeholder image",
        symptomPlaceholder: "Describe the symptoms, e.g., 'Yellow spots on leaves, black insects on the stem...'",
        diagnoseButton: "Diagnose",
        resetButton: "Reset",
        missingInfo: "Missing Information",
        missingInfoDesc: "Please provide both an image and a description.",
        diagnosisFailed: "Diagnosis Failed",
        diagnosisFailedDesc: "An error occurred during diagnosis. Please try again.",
        aiResultTitle: "AI Diagnosis Result",
        aiResultDesc: "Our AI will analyze the image and description to identify potential issues.",
        identification: "Identification",
        commonName: "Common Name",
        latinName: "Latin Name",
        status: {
            notAPlant: "Not a plant",
            healthy: "Healthy",
            unhealthy: "Unhealthy",
        },
        diagnosisDetails: "Diagnosis Details",
        remedy: "Recommended Actions",
        resultsAppearHere: "Results will appear here after diagnosis.",
    },
    newsPage: {
        title: "Latest Agricultural News",
        description: "Stay updated with the latest happenings in the agriculture sector.",
        error: "Failed to load agricultural news."
    }
  },
  hi: {
    guest: "अतिथि",
    header: {
      title: "एग्रीकार्ट सहायक",
      status: "ऑनलाइन · मॉडल v3.5",
    },
    nav: {
      chatAssistant: "चैट सहायक",
      marketData: "बाजार डेटा",
      weather: "मौसम",
      cropInfo: "फसल जानकारी",
      pestDiagnosis: "कीट निदान",
      news: "समाचार",
    },
    marketWatch: {
      title: "बाजार देखो",
      addCrop: "फसल जोड़ें",
    },
    agriNews: {
      title: "कृषि समाचार",
      readMore: "और पढ़ें...",
    },
    chat: {
      initialMessage: "नमस्ते! आज मैं आपकी खेती की जरूरतों में कैसे सहायता कर सकता हूँ?",
      placeholder: "अपना संदेश लिखें...",
      disclaimer: "एग्रो ट्रैक एआई गलतियाँ कर सकता है। महत्वपूर्ण जानकारी की जाँच करने पर विचार करें।",
    },
    marketDataPage: {
      title: "कमोडिटी की कीमतें",
      description: "भारत भर के विभिन्न मंडियों से वास्तविक समय की कीमतें।",
      searchPlaceholder: "एक वस्तु की खोज करें...",
      searchButton: "खोज",
      table: {
        commodity: "वस्तु",
        market: "बाजार (मंडी)",
        price: "मूल्य (प्रति क्विंटल)",
      },
      error: "बाजार डेटा लोड करने में विफल।",
      searchError: "वस्तु खोजने में विफल।",
    },
    weatherPage: {
        title: "मौसम पूर्वानुमान",
        description: "वर्तमान स्थितियाँ और 7-दिन का पूर्वानुमान।",
        searchPlaceholder: "एक स्थान दर्ज करें...",
        searchButton: "खोज",
        current: {
            wind: "हवा",
            humidity: "नमी",
        },
        forecast: "7-दिन का पूर्वानुमान",
        error: "के लिए मौसम लोड करने में विफल",
        loadError: "मौसम का पूर्वानुमान लोड नहीं किया जा सका। कृपया एक अलग स्थान का प्रयास करें।"
    },
    cropInfoPage: {
        searchPlaceholder: "एक फसल की खोज करें...",
        backButton: "फसल सूची पर वापस जाएं",
        loadingError: "फसल की जानकारी लोड करने में विफल।",
        detailsError: "के लिए विवरण लोड करने में विफल",
        cultivation: "खेती का विवरण",
        pestManagement: "कीट और रोग प्रबंधन",
        postHarvest: "कटाई के बाद और बाजार की जानकारी",
        couldNotLoad: "के लिए विवरण लोड नहीं किया जा सका"
    },
    pestDiagnosisPage: {
        title: "निदान के लिए सबमिट करें",
        description: "प्रभावित पौधे की एक तस्वीर अपलोड करें और समस्या का वर्णन करें।",
        uploadPrompt: "एक छवि अपलोड करने के लिए क्लिक करें",
        usePlaceholder: "या हमारी प्लेसहोल्डर छवि का उपयोग करें",
        symptomPlaceholder: "लक्षणों का वर्णन करें, जैसे, 'पत्तियों पर पीले धब्बे, तने पर काले कीड़े...'",
        diagnoseButton: "निदान करें",
        resetButton: "रीसेट",
        missingInfo: "आवश्यक जानकारी नहीं है",
        missingInfoDesc: "कृपया एक छवि और एक विवरण दोनों प्रदान करें।",
        diagnosisFailed: "निदान विफल",
        diagnosisFailedDesc: "निदान के दौरान एक त्रुटि हुई। कृपया पुन: प्रयास करें।",
        aiResultTitle: "एआई निदान परिणाम",
        aiResultDesc: "हमारा एआई संभावित समस्याओं की पहचान करने के लिए छवि और विवरण का विश्लेषण करेगा।",
        identification: "पहचान",
        commonName: "सामान्य नाम",
        latinName: "लैटिन नाम",
        status: {
            notAPlant: "एक पौधा नहीं",
            healthy: "स्वस्थ",
            unhealthy: "अस्वस्थ",
        },
        diagnosisDetails: "निदान विवरण",
        remedy: "अनुशंसित कार्रवाइयां",
        resultsAppearHere: "परिणाम निदान के बाद यहां दिखाई देंगे।",
    },
    newsPage: {
        title: "नवीनतम कृषि समाचार",
        description: "कृषि क्षेत्र में नवीनतम घटनाओं से अपडेट रहें।",
        error: "कृषि समाचार लोड करने में विफल।"
    }
  },
};
