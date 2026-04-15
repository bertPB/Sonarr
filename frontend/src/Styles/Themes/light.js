// Sonarr v5 — Cinema Lobby palette (light theme)
// Canonical OKLCH lives in DESIGN.md; hex values here are sRGB equivalents.
// All neutrals are warm-tinted at hue 80°; pure #000/#fff appear only on paper-card.

// === v5 primitives (canonical names) ===
const paper          = '#fbf8f4'; // oklch(98% 0.006 80) — page bg
const paperWarm      = '#f5f1ec'; // oklch(96% 0.008 80) — sidebar, sticky surfaces, table zebra
const paperCard      = '#ffffff'; // oklch(100% 0 0) — elevated cards, modals
const hairline       = '#e0deda'; // oklch(90% 0.006 80) — 1px dividers
const hairlineStrong = '#c7c4be'; // oklch(82% 0.008 80) — input rim at rest
const ink            = '#14110c'; // oklch(18% 0.012 80) — primary text
const inkSoft        = '#36322d'; // oklch(32% 0.010 80) — secondary text, button labels
const inkMuted       = '#6b6864'; // oklch(52% 0.008 80) — metadata, helper copy
const inkFaint       = '#a6a4a0'; // oklch(72% 0.006 80) — placeholders, disabled

// EXPLORATION (revertible): swapped the Cinema-Lobby ember anchor to Sonarr's
// brand blue. The token names stay `ember*` so every consumer (CSS, focus
// rings, hover states) picks up the new color without code churn.
// Original ember: #c8801f / #ad5200 / #dca55e
const ember          = '#35c5f4'; // oklch(78% 0.130 215) — bright accent (fills, focus ring, active state)
const emberDeep      = '#0073a8'; // oklch(50% 0.130 220) — text on light (scope caption, link rest)
const emberGlow      = '#82d8f7'; // oklch(85% 0.100 215) — focus glow

const statusAiring   = '#51995d'; // oklch(62% 0.115 148) — sage
const statusUpcoming = '#dc9242'; // oklch(72% 0.130 65) — burnt orange
const statusFinished = '#83807b'; // neutral
const statusHiatus   = '#7c7a76'; // dim neutral
const statusMissing  = '#c9493f'; // oklch(58% 0.165 28) — terracotta (NOT fire-engine)
const statusGrabbing = '#4e87ae'; // oklch(60% 0.085 240) — slate (only blue in system)

module.exports = {

  //
  // === v5 named tokens (new code uses these) ===

  paper,
  paperWarm,
  paperCard,
  hairline,
  hairlineStrong,
  ink,
  inkSoft,
  inkMuted,
  inkFaint,
  ember,
  emberDeep,
  emberGlow,
  statusAiring,
  statusUpcoming,
  statusFinished,
  statusHiatus,
  statusMissing,
  statusGrabbing,

  //
  // === Legacy keys (back-compat — existing CSS modules use these) ===
  // Every legacy key now resolves to a v5-aligned value, automatically re-skinning
  // every existing surface as part of the trojan-horse migration.

  textColor:     inkSoft,
  defaultColor:  ink,
  disabledColor: inkFaint,
  dimColor:      inkMuted,
  black:         ink,           // never pure black
  white:         paperCard,
  offWhite:      paper,
  primaryColor:  ember,         // was sonarrBlue
  selectedColor: ember,
  successColor:  statusAiring,
  dangerColor:   statusMissing,
  warningColor:  statusUpcoming,
  infoColor:     emberDeep,
  purple:        '#7a43b6',
  pink:          '#ff69b4',
  sonarrBlue:    ember,         // legacy refs to brand blue resolve to ember
  helpTextColor: inkMuted,
  darkGray:      inkMuted,
  gray:          inkFaint,
  lightGray:     hairline,
  mediumGray:    inkMuted,

  // Theme Colors
  themeBlue:           ember,
  themeAlternateBlue:  emberDeep,
  themeRed:            statusMissing,
  themeDarkColor:      ink,        // was navy #3a3f51
  themeLightColor:     inkSoft,    // was navy #4f566f
  pageBackground:      paper,
  pageFooterBackground: paperWarm,

  torrentColor: statusAiring,
  usenetColor:  emberGlow,

  // Labels
  inverseLabelColor:     hairline,
  inverseLabelTextColor: inkSoft,
  disabledLabelColor:    inkFaint,
  infoTextColor:         paperCard,

  // Links
  defaultLinkHoverColor: ink,
  linkColor:             emberDeep,
  linkHoverColor:        ember,

  // Header — was sonarrAlternateBlue, now paper to dissolve into the page
  pageHeaderBackgroundColor: paper,

  // Sidebar — was navy #3a3f51, now warm paper
  sidebarColor:                  inkSoft,
  sidebarBackgroundColor:        paperWarm,
  sidebarActiveBackgroundColor:  paperCard,

  // Toolbar
  toolbarColor:                          inkSoft,
  toolbarBackgroundColor:                paperWarm,
  toolbarMenuItemBackgroundColor:        paperWarm,
  toolbarMenuItemHoverBackgroundColor:   paperCard,
  toolbarLabelColor:                     inkMuted,

  // Accents
  borderColor:                hairline,
  inputBorderColor:           hairlineStrong,
  inputBoxShadowColor:        'rgba(0, 0, 0, 0.04)',
  inputFocusBorderColor:      ember,
  // Derived live from --ember via color-mix so the ember constant is the
  // single source of truth for every alpha-tinted ember surface.
  inputFocusBoxShadowColor:   'color-mix(in oklch, var(--ember) 16%, transparent)',
  inputErrorBorderColor:      statusMissing,
  inputErrorBoxShadowColor:   'rgba(201, 73, 63, 0.16)',
  inputWarningBorderColor:    statusUpcoming,
  inputWarningBoxShadowColor: 'rgba(220, 146, 66, 0.16)',
  colorImpairedGradient:        paperCard,
  colorImpairedGradientDark:    paperWarm,
  colorImpairedDangerGradient:  statusMissing,
  colorImpairedWarningGradient: statusUpcoming,
  colorImpairedPrimaryGradient: ember,
  colorImpairedGrayGradient:    inkFaint,

  //
  // Buttons — primary is ink-on-paper at rest, ember on hover

  defaultButtonTextColor:     ink,
  defaultBackgroundColor:     paperCard,
  defaultBorderColor:         hairlineStrong,
  defaultHoverBackgroundColor: paperWarm,
  defaultHoverBorderColor:    ember,

  primaryBackgroundColor:      ink,
  primaryBorderColor:          ink,
  primaryHoverBackgroundColor: emberDeep,
  primaryHoverBorderColor:     emberDeep,

  successBackgroundColor:      statusAiring,
  successBorderColor:          statusAiring,
  successHoverBackgroundColor: '#458352',
  successHoverBorderColor:     '#3c7448',

  warningBackgroundColor:      statusUpcoming,
  warningBorderColor:          statusUpcoming,
  warningHoverBackgroundColor: '#c97f30',
  warningHoverBorderColor:     '#b06f24',

  dangerBackgroundColor:      statusMissing,
  dangerBorderColor:          statusMissing,
  dangerHoverBackgroundColor: '#b03f36',
  dangerHoverBorderColor:     '#9b362d',

  iconButtonDisabledColor:    inkFaint,
  iconButtonHoverColor:       inkSoft,
  iconButtonHoverLightColor:  ink,

  //
  // Modal

  modalBackdropBackgroundColor: 'rgba(0, 0, 0, 0.45)',
  modalBackgroundColor:         paperCard,
  modalCloseButtonHoverColor:   inkSoft,

  //
  // Menu
  menuItemColor:                inkSoft,
  menuItemHoverColor:           ink,
  menuItemHoverBackgroundColor: paperWarm,

  //
  // Toolbar (selected / hover accents)
  toobarButtonSelectedColor: ember,

  //
  // Scroller
  scrollbarBackgroundColor:      hairlineStrong,
  scrollbarHoverBackgroundColor: inkMuted,

  //
  // Card — flat at rest, lifts on hover via :hover rules in component CSS
  cardBackgroundColor:          paperCard,
  cardShadowColor:              'rgba(0, 0, 0, 0.08)',
  cardAlternateBackgroundColor: paperWarm,
  cardCenterBackgroundColor:    paperCard,

  //
  // Alert
  alertDangerBorderColor:     statusMissing,
  alertDangerBackgroundColor: 'rgba(201, 73, 63, 0.08)',
  alertDangerColor:           '#8a2e26',

  alertInfoBorderColor:     ember,
  alertInfoBackgroundColor: 'color-mix(in oklch, var(--ember) 8%, transparent)',
  alertInfoColor:           emberDeep,

  alertSuccessBorderColor:     statusAiring,
  alertSuccessBackgroundColor: 'rgba(81, 153, 93, 0.08)',
  alertSuccessColor:           '#36683f',

  alertWarningBorderColor:     statusUpcoming,
  alertWarningBackgroundColor: 'rgba(220, 146, 66, 0.08)',
  alertWarningColor:           '#8e5b29',

  //
  // Slider
  sliderAccentColor: ember,

  //
  // Form
  inputBackgroundColor:         paper,
  inputReadOnlyBackgroundColor: paperWarm,
  inputHoverBackgroundColor:    paperCard,
  inputSelectedBackgroundColor: 'color-mix(in oklch, var(--ember) 6%, transparent)',
  advancedFormLabelColor:       statusUpcoming,
  disabledCheckInputColor:      hairline,
  disabledInputColor:           inkFaint,

  //
  // Popover
  popoverTitleBackgroundColor:  paperWarm,
  popoverTitleBorderColor:      hairline,
  popoverBodyBackgroundColor:   paperCard,
  popoverShadowColor:           'rgba(0, 0, 0, 0.18)',
  popoverArrowBorderColor:      paperCard,

  popoverTitleBackgroundInverseColor: ink,
  popoverTitleBorderInverseColor:     inkSoft,
  popoverShadowInverseColor:          'rgba(0, 0, 0, 0.32)',
  popoverArrowBorderInverseColor:     'rgba(20, 17, 12, 0.92)',

  //
  // Calendar
  calendarTodayBackgroundColor:  paperWarm,
  calendarBackgroundColor:       paper,
  calendarBorderColor:           hairline,
  calendarTextDim:               inkMuted,
  calendarTextDimAlternate:      inkSoft,
  calendarFullColorFilter:       'saturate(0.9) contrast(0.95)',

  //
  // Table
  tableRowHoverBackgroundColor: paperWarm,

  //
  // Series
  addSeriesBackgroundColor:           paperWarm,
  seriesBackgroundColor:              paperWarm,
  searchIconContainerBackgroundColor: paper,
  collapseButtonBackgroundColor:      paper,

  //
  // Season
  seasonBackgroundColor:   paperCard,
  episodesBackgroundColor: paper,

  //
  // misc
  progressBarFrontTextColor:  paperCard,
  progressBarBackTextColor:   inkSoft,
  progressBarBackgroundColor: hairline,
  logEventsBackgroundColor:   paperCard
};
