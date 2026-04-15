// Sonarr v5 — Cinema Lobby palette (dark theme)
// Canonical OKLCH lives in DESIGN.md; hex values here are sRGB equivalents.
// All neutrals are warm-tinted at hue 80°; light and dark are tonally inverted, not separately designed.

// === v5 primitives (canonical names) ===
const night                = '#0d0b08'; // oklch(15% 0.008 80) — page bg
const nightSoft            = '#161310'; // oklch(19% 0.008 80) — sidebar, sticky
const nightCard            = '#1f1c18'; // oklch(23% 0.010 80) — cards
const nightElevated        = '#2a2620'; // oklch(27% 0.012 80) — popover, command palette
const nightHairline        = '#302d28'; // oklch(30% 0.010 80) — 1px dividers
const nightHairlineStrong  = '#46423b'; // oklch(38% 0.012 80) — input rim at rest
const nightText            = '#f1eeea'; // oklch(95% 0.006 80) — primary text
const nightTextMuted       = '#9b9893'; // oklch(68% 0.008 80)
const nightTextFaint       = '#66635e'; // oklch(50% 0.008 80)

// EXPLORATION (revertible): Sonarr blue anchor for dark surface, slightly
// lifted in lightness so it pops against night. Original ember was a warm amber.
// Original ember (dark): #d28a2c / #c8801f / #dca55e
const ember          = '#5cd0f5'; // ~oklch(82% 0.115 215) — Sonarr blue, lifted for dark
const emberDeep      = '#35c5f4'; // ~oklch(78% 0.130 215) — pressed/active on dark
const emberGlow      = '#82d8f7'; // ~oklch(85% 0.100 215) — focus glow

const statusAiring   = '#5fa56b';
const statusUpcoming = '#dc9242';
const statusFinished = '#83807b';
const statusHiatus   = '#7c7a76';
const statusMissing  = '#c9493f';
const statusGrabbing = '#5d96bc';

module.exports = {

  //
  // === v5 named tokens (new code uses these) ===

  // Note: in dark theme we expose the v5 keys as if they were "paper" etc.,
  // so component CSS can reference var(--paper) and get the correct surface
  // for whichever theme is active. The names mean "primary surface" not
  // "literally white paper".
  paper:           night,
  paperWarm:       nightSoft,
  paperCard:       nightCard,
  hairline:        nightHairline,
  hairlineStrong:  nightHairlineStrong,
  ink:             nightText,
  inkSoft:         nightText,
  inkMuted:        nightTextMuted,
  inkFaint:        nightTextFaint,
  ember,
  emberDeep,
  emberGlow,
  statusAiring,
  statusUpcoming,
  statusFinished,
  statusHiatus,
  statusMissing,
  statusGrabbing,

  // Also expose night-* names for code that wants to be theme-explicit
  night,
  nightSoft,
  nightCard,
  nightElevated,
  nightHairline,
  nightHairlineStrong,
  nightText,
  nightTextMuted,
  nightTextFaint,

  //
  // === Legacy keys (back-compat) ===

  textColor:     nightText,
  defaultColor:  nightText,
  disabledColor: nightTextFaint,
  dimColor:      nightTextMuted,
  black:         '#000',
  white:         nightText,
  offWhite:      night,
  primaryColor:  ember,
  selectedColor: ember,
  successColor:  statusAiring,
  dangerColor:   statusMissing,
  warningColor:  statusUpcoming,
  infoColor:     ember,
  purple:        '#7a43b6',
  pink:          '#ff69b4',
  sonarrBlue:    ember,
  helpTextColor: nightTextMuted,
  darkGray:      nightTextFaint,
  gray:          nightTextMuted,
  lightGray:     nightHairline,
  mediumGray:    nightTextMuted,

  // Theme Colors
  themeBlue:           ember,
  themeAlternateBlue:  emberDeep,
  themeRed:            statusMissing,
  themeDarkColor:      nightSoft,
  themeLightColor:     nightCard,
  pageBackground:      night,
  pageFooterBackground: 'rgba(0, 0, 0, .25)',

  torrentColor: statusAiring,
  usenetColor:  emberGlow,

  // Labels
  inverseLabelColor:     nightHairline,
  inverseLabelTextColor: nightText,
  disabledLabelColor:    nightTextFaint,
  infoTextColor:         nightText,

  // Links
  defaultLinkHoverColor: nightText,
  linkColor:             ember,
  linkHoverColor:        emberGlow,

  // Header
  pageHeaderBackgroundColor: night,

  // Sidebar
  sidebarColor:                  nightText,
  sidebarBackgroundColor:        nightSoft,
  sidebarActiveBackgroundColor:  nightCard,

  // Toolbar
  toolbarColor:                          nightText,
  toolbarBackgroundColor:                nightSoft,
  toolbarMenuItemBackgroundColor:        nightCard,
  toolbarMenuItemHoverBackgroundColor:   nightElevated,
  toolbarLabelColor:                     nightTextMuted,

  // Accents
  borderColor:                nightHairline,
  inputBorderColor:           nightHairlineStrong,
  inputBoxShadowColor:        'rgba(0, 0, 0, 0.18)',
  inputFocusBorderColor:      ember,
  // Derived live from --ember via color-mix.
  inputFocusBoxShadowColor:   'color-mix(in oklch, var(--ember) 18%, transparent)',
  inputErrorBorderColor:      statusMissing,
  inputErrorBoxShadowColor:   'rgba(201, 73, 63, 0.18)',
  inputWarningBorderColor:    statusUpcoming,
  inputWarningBoxShadowColor: 'rgba(220, 146, 66, 0.18)',
  colorImpairedGradient:        '#707070',
  colorImpairedGradientDark:    '#424242',
  colorImpairedDangerGradient:  statusMissing,
  colorImpairedWarningGradient: statusUpcoming,
  colorImpairedPrimaryGradient: ember,
  colorImpairedGrayGradient:    nightTextMuted,

  //
  // Buttons

  defaultButtonTextColor:     nightText,
  defaultBackgroundColor:     nightCard,
  defaultBorderColor:         nightHairlineStrong,
  defaultHoverBackgroundColor: nightElevated,
  defaultHoverBorderColor:    ember,

  primaryBackgroundColor:      nightText,  // ink-on-paper inverted: paper-on-ink for dark
  primaryBorderColor:          nightText,
  primaryHoverBackgroundColor: ember,
  primaryHoverBorderColor:     ember,

  successBackgroundColor:      statusAiring,
  successBorderColor:          statusAiring,
  successHoverBackgroundColor: '#508f5a',
  successHoverBorderColor:     '#467e4f',

  warningBackgroundColor:      statusUpcoming,
  warningBorderColor:          statusUpcoming,
  warningHoverBackgroundColor: '#c97f30',
  warningHoverBorderColor:     '#b06f24',

  dangerBackgroundColor:      statusMissing,
  dangerBorderColor:          statusMissing,
  dangerHoverBackgroundColor: '#b03f36',
  dangerHoverBorderColor:     '#9b362d',

  iconButtonDisabledColor:    nightTextFaint,
  iconButtonHoverColor:       nightTextMuted,
  iconButtonHoverLightColor:  nightText,

  //
  // Modal

  modalBackdropBackgroundColor: 'rgba(0, 0, 0, 0.65)',
  modalBackgroundColor:         nightCard,
  modalCloseButtonHoverColor:   nightTextMuted,

  //
  // Menu
  menuItemColor:                nightText,
  menuItemHoverColor:           ember,
  menuItemHoverBackgroundColor: nightElevated,

  //
  // Toolbar (selected / hover accents)
  toobarButtonSelectedColor: ember,

  //
  // Scroller
  scrollbarBackgroundColor:      nightHairlineStrong,
  scrollbarHoverBackgroundColor: nightTextFaint,

  //
  // Card
  cardBackgroundColor:          nightCard,
  cardShadowColor:              'rgba(0, 0, 0, 0.45)',
  cardAlternateBackgroundColor: nightCard,
  cardCenterBackgroundColor:    nightSoft,

  //
  // Alert
  alertDangerBorderColor:     statusMissing,
  alertDangerBackgroundColor: 'rgba(201, 73, 63, 0.10)',
  alertDangerColor:           nightText,

  alertInfoBorderColor:     ember,
  alertInfoBackgroundColor: 'color-mix(in oklch, var(--ember) 10%, transparent)',
  alertInfoColor:           nightText,

  alertSuccessBorderColor:     statusAiring,
  alertSuccessBackgroundColor: 'rgba(95, 165, 107, 0.10)',
  alertSuccessColor:           nightText,

  alertWarningBorderColor:     statusUpcoming,
  alertWarningBackgroundColor: 'rgba(220, 146, 66, 0.10)',
  alertWarningColor:           nightText,

  //
  // Slider
  sliderAccentColor: ember,

  //
  // Form
  inputBackgroundColor:         nightSoft,
  inputReadOnlyBackgroundColor: night,
  inputHoverBackgroundColor:    nightCard,
  inputSelectedBackgroundColor: 'color-mix(in oklch, var(--ember) 6%, transparent)',
  advancedFormLabelColor:       statusUpcoming,
  disabledCheckInputColor:      nightHairlineStrong,
  disabledInputColor:           nightTextFaint,

  //
  // Popover
  popoverTitleBackgroundColor:  nightElevated,
  popoverTitleBorderColor:      nightHairline,
  popoverBodyBackgroundColor:   nightCard,
  popoverShadowColor:           'rgba(0, 0, 0, 0.32)',
  popoverArrowBorderColor:      nightCard,

  popoverTitleBackgroundInverseColor: nightText,
  popoverTitleBorderInverseColor:     nightTextMuted,
  popoverShadowInverseColor:          'rgba(0, 0, 0, 0.32)',
  popoverArrowBorderInverseColor:     'rgba(241, 238, 234, 0.92)',

  //
  // Calendar
  calendarTodayBackgroundColor:  nightCard,
  calendarBackgroundColor:       nightSoft,
  calendarBorderColor:           nightHairline,
  calendarTextDim:               nightTextMuted,
  calendarTextDimAlternate:      nightText,
  calendarFullColorFilter:       'saturate(0.9) contrast(1.05) brightness(0.92)',

  //
  // Table
  tableRowHoverBackgroundColor: 'rgba(255, 255, 255, 0.04)',

  //
  // Series
  addSeriesBackgroundColor:           nightSoft,
  seriesBackgroundColor:              nightSoft,
  searchIconContainerBackgroundColor: nightSoft,
  collapseButtonBackgroundColor:      nightSoft,

  //
  // Season
  seasonBackgroundColor:   nightCard,
  episodesBackgroundColor: nightSoft,

  //
  // misc
  progressBarFrontTextColor:  nightText,
  progressBarBackTextColor:   nightText,
  progressBarBackgroundColor: nightHairline,
  logEventsBackgroundColor:   nightSoft
};
