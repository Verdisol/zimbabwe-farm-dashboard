export type Language = 'en' | 'sn' | 'nd'

export const languages: { key: Language; label: string }[] = [
  { key: 'en', label: 'English' },
  { key: 'sn', label: 'Shona' },
  { key: 'nd', label: 'Ndebele' },
]

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Sidebar
    sidebar_title: 'Farm Dashboard',
    sidebar_subtitle: 'Zimbabwe',
    nav_overview: 'Overview',
    nav_map: 'Map',
    nav_weather: 'Weather',
    nav_drought: 'Drought Monitor',
    nav_predictions: 'Predictions',
    nav_charts: 'Charts',
    nav_market: 'Market',
    nav_learn: 'Learn',
    nav_help: 'Help',
    nav_subscribe: 'Subscription',
    nav_logout: 'Log out',

    // Top bar
    topbar_welcome: 'Welcome back, Farmer',
    topbar_subtitle: 'Your farm at a glance',

    // Tab headings
    tab_overview_title: 'Overview',
    tab_overview_sub: 'Your farm at a glance',
    tab_map_title: 'Map',
    tab_map_sub: 'Explore your district and surrounding areas',
    tab_weather_title: 'Weather',
    tab_weather_sub: 'Current conditions and 7-day forecast',
    tab_drought_title: 'Drought Monitor',
    tab_drought_sub: 'Live drought and bumper harvest status for your district',
    tab_predictions_title: 'Predictions',
    tab_predictions_sub: 'Random Forest predictions of maize yield',
    tab_charts_title: 'Charts',
    tab_charts_sub: 'Visual analysis of maize yield, crop distribution, and frequency',
    tab_market_title: 'Market',
    tab_market_sub: 'Producer prices and wholesale market rates across Zimbabwe',
    tab_learn_title: 'Did You Know?',
    tab_learn_sub: 'Crop education, pest help, disease identification, and best practices',
    tab_help_title: 'Help Centre',
    tab_help_sub: 'Get support, ask questions, or contact a consultant',
    tab_subscribe_title: 'Subscription',
    tab_subscribe_sub: 'Choose a plan and pay with EcoCash, Mukuru, InnBucks, or Bank Transfer',
  },

  sn: {
    // Sidebar
    sidebar_title: 'Dhibhodhi yePurazi',
    sidebar_subtitle: 'Zimbabwe',
    nav_overview: 'Mafungiro',
    nav_map: 'Mepu',
    nav_weather: 'Mamiriro ekunze',
    nav_drought: 'Kuoma kwemvura',
    nav_predictions: 'Zvinofanotaurwa',
    nav_charts: 'Machati',
    nav_market: 'Musika',
    nav_learn: 'Dzidza',
    nav_help: 'Rubatsiro',
    nav_subscribe: 'Kubhadhara',
    nav_logout: 'Buda',

    // Top bar
    topbar_welcome: 'Mauya zvakare, Murimi',
    topbar_subtitle: 'Purazi rako muchidimbu',

    // Tab headings
    tab_overview_title: 'Mafungiro',
    tab_overview_sub: 'Purazi rako muchidimbu',
    tab_map_title: 'Mepu',
    tab_map_sub: 'Ongorora dunhu rako nenzvimbo dzakatenderedza',
    tab_weather_title: 'Mamiriro ekunze',
    tab_weather_sub: 'Mamiriro azvino uye fungidziro yemazuva manomwe',
    tab_drought_title: 'Kuoma kwemvura',
    tab_drought_sub: 'Mamiriro ekuoma kwemvura nedunhu rako',
    tab_predictions_title: 'Zvinofanotaurwa',
    tab_predictions_sub: 'Kufanotaura kwegoho re chibage ne Random Forest',
    tab_charts_title: 'Machati',
    tab_charts_sub: 'Ongorora kwegoho, kugoverwa kwezvirimwa, uye kuwanda',
    tab_market_title: 'Musika',
    tab_market_sub: 'Mitengo yezvirimwa muZimbabwe',
    tab_learn_title: 'Waizviziva here?',
    tab_learn_sub: 'Dzidziso yezvirimwa, zvipembenene, uye mazano akanaka',
    tab_help_title: 'Nzvimbo yerubatsiro',
    tab_help_sub: 'Wana rubatsiro kana kubvunza mubatsiri',
    tab_subscribe_title: 'Kubhadhara',
    tab_subscribe_sub: 'Sarudza chirongwa uye bhadhara neEcoCash, Mukuru, InnBucks, kana Bhangi',
  },

  nd: {
    // Sidebar
    sidebar_title: 'Ibhodwe lePulazi',
    sidebar_subtitle: 'Zimbabwe',
    nav_overview: 'Ukubona konke',
    nav_map: 'Ibalazwe',
    nav_weather: 'Isimo sezulu',
    nav_drought: 'Isomiso',
    nav_predictions: 'Okulindelwe',
    nav_charts: 'Amashadi',
    nav_market: 'Imakethe',
    nav_learn: 'Funda',
    nav_help: 'Usizo',
    nav_subscribe: 'Ukubhalisa',
    nav_logout: 'Phuma',

    // Top bar
    topbar_welcome: 'Wamukelekile futhi, Umlimi',
    topbar_subtitle: 'Ipulazi lakho ngamafuphi',

    // Tab headings
    tab_overview_title: 'Ukubona konke',
    tab_overview_sub: 'Ipulazi lakho ngamafuphi',
    tab_map_title: 'Ibalazwe',
    tab_map_sub: 'Hlola isifunda sakho nezindawo ezizungezile',
    tab_weather_title: 'Isimo sezulu',
    tab_weather_sub: 'Isimo samanje kanye nesibikezelo sezinsuku eziyisikhombisa',
    tab_drought_title: 'Isomiso',
    tab_drought_sub: 'Isimo sesomiso kanye nesivuno esihle esifundeni sakho',
    tab_predictions_title: 'Okulindelwe',
    tab_predictions_sub: 'Isibikezelo sesivuno sombila nge Random Forest',
    tab_charts_title: 'Amashadi',
    tab_charts_sub: 'Ukuhlaziywa kwesivuno, ukusatshalaliswa kwezitshalo, kanye nobuningi',
    tab_market_title: 'Imakethe',
    tab_market_sub: 'Izintengo zomkhiqizo eZimbabwe',
    tab_learn_title: 'Bewazi yini?',
    tab_learn_sub: 'Imfundo yezitshalo, izinambuzane, kanye nezeluleko ezinhle',
    tab_help_title: 'Isikhungo sosizo',
    tab_help_sub: 'Thola usizo noma buza umeluleki',
    tab_subscribe_title: 'Ukubhalisa',
    tab_subscribe_sub: 'Khetha uhlelo bese ukhokha ngeEcoCash, Mukuru, InnBucks, noma iBhange',
  },
}

export const defaultLanguage: Language = 'en'

export function getSavedLanguage(): Language {
  if (typeof window === 'undefined') return defaultLanguage
  const saved = localStorage.getItem('language') as Language | null
  if (saved && translations[saved]) return saved
  return defaultLanguage
}

export function saveLanguage(lang: Language) {
  if (typeof window === 'undefined') return
  localStorage.setItem('language', lang)
  window.dispatchEvent(new Event('languageChanged'))
}

export function t(lang: Language, key: string): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key
}
