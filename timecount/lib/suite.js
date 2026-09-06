/**
 * ibm.io tools suite — top-right panel (icons + micro titles) + shared look.
 * Load as lib/suite.js from each tool folder (or ../lib/suite.js from nested tools).
 */
(function (global) {
  'use strict';

  var SHARED_KEY = 'ibm.tools.shared';
  var THEMES = ['light', 'dark', 'contrast', 'paper', 'glass', 'frost', 'brutal', 'loom', 'tank', 'nes'];
  /* Shared look keys — theme/chrome/digits/faces sync across the suite */
  var LOOK_KEYS = ['theme', 'ui', 'font', 'faces'];
  var STYLE_ID = 'ibm-suite-styles';

  /** Inline 16×16 stroke icons (viewBox 0 0 16 16). */
  var I = {
    words: '<path d="M2.5 3.5h11M2.5 8h8M2.5 12.5h10"/>',
    time: '<circle cx="8" cy="8" r="5.2"/><path d="M8 5.2v3.1l2.2 1.3"/>',
    bill: '<rect x="3" y="2.5" width="10" height="11" rx="1"/><path d="M5.5 6h5M5.5 8.5h3.5M5.5 11h4"/>',
    unit: '<path d="M3 11.5 7.2 4.5h1.6L13 11.5"/><path d="M4.8 9.2h6.4"/>',
    ratio: '<rect x="2.5" y="4" width="7" height="7" rx=".8"/><path d="M10.5 6.5h3v6h-6v-3"/>',
    budget: '<rect x="2.5" y="3.5" width="4.2" height="9" rx=".6"/><rect x="9.3" y="5.5" width="4.2" height="7" rx=".6"/>',
    odds: '<circle cx="5.2" cy="8" r="2.4"/><circle cx="10.8" cy="8" r="2.4"/><path d="M7.6 8h.8"/>',
    scalemap: '<path d="M2.5 12.5 8 3.5l5.5 9"/><path d="M5 12.5h6"/>',
    hourly: '<circle cx="8" cy="8" r="5.2"/><path d="M8 5v3.2l2.4 0"/>',
    typescale: '<path d="M3 12.5V4.5h3.2M2.5 4.5h4.2M8.5 12.5V7h2.4M8.2 7h3"/>',
    combo: '<circle cx="4.5" cy="5" r="1.4"/><circle cx="11.5" cy="5" r="1.4"/><circle cx="8" cy="11" r="1.4"/><path d="M5.6 5.8 7.2 9.6M10.4 5.8 8.8 9.6"/>',
    deal: '<rect x="4" y="2.5" width="8" height="11" rx="1"/><path d="M6.5 6h3M6.5 8.5h3M6.5 11h2"/>',
    sample: '<path d="M3 12.5V5.5l2.5 2 2.5-3.5 2.5 4 2.5-2.5v6.5z"/>',
    streak: '<circle cx="8" cy="8" r="5.2"/><path d="M8 4.5c1.6 0 2.8 1 2.8 2.2S9.4 8.5 8 8.5"/>',
    fuel: '<path d="M4 13V4.5h5.5V13M9.5 7h1.8c.8 0 1.4.6 1.4 1.4V11"/><path d="M6 7h1.5"/>',
    bandwidth: '<path d="M2.5 10.5 5 6.5l2.2 3 2.3-5 2.5 6 1.5-2.5"/><path d="M2.5 12.5h11"/>',
    exposure: '<circle cx="8" cy="8" r="5.2"/><circle cx="8" cy="8" r="2"/><path d="M8 2.8v1.4M8 11.8v1.4M2.8 8h1.4M11.8 8h1.4"/>',
    dose: '<path d="M6 3.5h4v3.2c1.6 1 2.6 2.6 2.6 4.4A4.6 4.6 0 0 1 8 15.5 4.6 4.6 0 0 1 3.4 11c0-1.8 1-3.4 2.6-4.4z"/>',
    tax: '<rect x="3.5" y="2.5" width="9" height="11" rx="1"/><path d="M5.5 5.5h5M5.5 8h3.5M5.5 10.5h4M9.5 12.5l1.5-1.5"/>',
    invoice: '<rect x="3" y="2.5" width="10" height="11" rx="1"/><path d="M5 5.5h6M5 8h6M5 10.5h3.5"/><path d="M10.2 10.2h1.8v1.8"/>',
    pace: '<path d="M2.5 11.5 6 5.5l2.5 3.5L12 3.5"/><path d="M11 3.5h2.5V6"/>',
    contrast: '<circle cx="6" cy="8" r="3.2"/><path d="M10 4.8a3.2 3.2 0 0 1 0 6.4"/><path d="M10 4.8v6.4"/>',
    bayes: '<path d="M3 12.5V8.5l3-3 3 2 4-5"/><path d="M3 12.5h10"/>',
    tools: '<rect x="2.5" y="2.5" width="4.2" height="4.2" rx=".6"/><rect x="9.3" y="2.5" width="4.2" height="4.2" rx=".6"/><rect x="2.5" y="9.3" width="4.2" height="4.2" rx=".6"/><rect x="9.3" y="9.3" width="4.2" height="4.2" rx=".6"/>'
  };

  var GROUPS = [
    { id: 'desk', label: 'desk' },
    { id: 'money', label: 'money' },
    { id: 'convert', label: 'convert' },
    { id: 'form', label: 'form' },
    { id: 'chance', label: 'chance' }
  ];

  var MAP_HELP = {
    lead: 'Quiet map of local instruments.',
    body: 'Every tool runs in the browser — no accounts, no sync cloud. Theme, chrome, and digit faces follow you via shared look settings. Open any tile to work; the grid in the top-right is the same map from every page.',
    use: [
      'Use the circled i on any tool for a plain-language walkthrough — each one shows the hard equation it runs.',
      'Settings (look / chrome / digits) sync across the suite.',
      'Copy and link under many faces share a result snapshot.'
    ]
  };

  var TOOLS = [
    {
      id: 'wordcount', label: 'words', blurb: 'count · draft', group: 'desk', paths: ['wordcount', 'wordcounter'], icon: I.words, status: 'live',
      help: {
        lead: 'A frictionless draft pad that counts as you type.',
        body: 'Paste or write in the editor. The hero shows the active metric — words by default — with reading time, sentences, characters, and more one swipe away. Everything stays on this device.',
        math: {
          eq: [
            'words = tokens split on whitespace',
            'reading ≈ words ÷ 200',
            'speaking ≈ words ÷ 130',
            'pages ≈ words ÷ 250'
          ],
          explain: 'Words are runs of text separated by spaces or line breaks. Sentences end at . ! ? …; paragraphs at blank lines. Reading and speaking times convert words into minutes at fixed speeds (200 and 130 words per minute). Pages assume ~250 words each — a manuscript rule of thumb, not a printer layout.'
        },
        use: [
          'Type or paste in the draft; counts update live.',
          'Swipe or drag the hero sideways to cycle metrics (words, characters, reading time…).',
          'Settings hold theme, chrome, and a short primer on how counts are defined.'
        ]
      }
    },
    {
      id: 'timecount', label: 'time', blurb: 'duration · limit', group: 'desk', paths: ['timecount'], icon: I.time, status: 'live',
      help: {
        lead: 'A session clock — count up, count down, or mark splits.',
        body: 'Duration runs forward from start. Limit counts down from a target (pomodoro-style). Splits freeze lap marks without stopping the clock. Soft presets nudge common limits while a session is running.',
        math: {
          eq: [
            'elapsed = paused_total + (now − started)',
            'remaining = max(0, limit − elapsed)'
          ],
          explain: 'While running, elapsed is whatever was already banked plus the open segment since the last start. In limit mode the face is what’s left: the target minus elapsed, floored at zero. Splits are just timestamps along that same elapsed line — they don’t change the clock math.'
        },
        use: [
          'Start / pause from the dial; scrub vertically to nudge the limit.',
          'Horizontal scrub on the dial jumps in coarser 5-minute steps.',
          'Enter limits as 25m, 5:00, or bare minutes.'
        ]
      }
    },
    {
      id: 'bill', label: 'bill', blurb: 'tip · split', group: 'money', paths: ['bill'], icon: I.bill, status: 'live',
      help: {
        lead: 'Split a check with tip baked in.',
        body: 'Enter the receipt total, tip percent, and party size. The face shows what each person owes. The stage draws a receipt well — tip as a ribbon, people as columns.',
        math: {
          eq: [
            'tip = total × (tip% ÷ 100)',
            'grand = total + tip',
            'each = grand ÷ people'
          ],
          explain: 'Tip is a straight percent of the receipt total (pre-split). Add tip to get the grand total, then divide evenly by how many people are paying. The face is that per-person share.'
        },
        use: [
          'Enter the total and party size; pick a tip from the list.',
          'Scrub tip on the face or chart; drag sideways to change people.',
          'Settings can show tip as share of the grand total or as dollars.'
        ]
      }
    },
    {
      id: 'hourly', label: 'hourly', blurb: 'rate · project', group: 'money', paths: ['hourly'], icon: I.hourly, status: 'live',
      help: {
        lead: 'Turn an hourly rate into a project total.',
        body: 'Link $/hour, hours per day, and days of work. The face is the project total; day rate falls out of the same inputs. The calendar strip paints weeks as rows and days as hour ladders.',
        math: {
          eq: [
            'hours = hours/day × days',
            'project = rate × hours',
            'day rate = rate × hours/day'
          ],
          explain: 'Multiply the hourly rate by total hours (hours per day times days) for the project total. Day rate is the same rate times a single day’s hours — so the three numbers stay linked.'
        },
        use: [
          'Scrub days on the face; horizontal drag adjusts hours/day; pinch coarsens the rate.',
          'Toggle grain (days / weeks) and rate tint in settings.'
        ]
      }
    },
    {
      id: 'budget', label: 'budget', blurb: 'week envelopes', group: 'money', paths: ['budget'], icon: I.budget, status: 'live',
      help: {
        lead: 'Carve a weekly pot into spending envelopes.',
        body: 'Set the week\'s total, then size each envelope. Remaining shows in the pot well; drawers or a share chart show how the pot is allocated.',
        math: {
          eq: [
            'used = Σ envelopes',
            'left = pot − used'
          ],
          explain: 'Add every envelope. What’s left in the pot is the weekly total minus that sum. Negative left means you’re over — the face turns the overage into a warning, not a different formula.'
        },
        use: [
          'Edit the pot and each envelope row; the face tracks what\'s left.',
          'Scrub the stage to redistribute; settings pick drawer vs share view.'
        ]
      }
    },
    {
      id: 'fuel', label: 'fuel', blurb: 'mpg · trip cost', group: 'money', paths: ['fuel'], icon: I.fuel, status: 'live',
      help: {
        lead: 'Estimate fuel cost for a trip.',
        body: 'Miles ÷ mpg × price per gallon. The face is trip cost; tank fill is gallons needed. Route ticks teach distance with cost riding the nose of the path.',
        math: {
          eq: [
            'gallons = miles ÷ mpg',
            'cost = gallons × $/gal',
            'L/100km ≈ 235.215 ÷ mpg'
          ],
          explain: 'Gallons needed are distance divided by miles per gallon. Cost is those gallons times pump price. The metric conversion is the usual US highway identity — not a second trip estimate.'
        },
        use: [
          'Scrub miles on the face; linked axes adjust mpg and price.',
          'Watch gallons and cost update together under the face.'
        ]
      }
    },
    {
      id: 'tax', label: 'tax', blurb: 'tip · tax', group: 'money', paths: ['tax'], icon: I.tax, status: 'live',
      help: {
        lead: 'Stack sales tax and tip on a subtotal.',
        body: 'Start from the pre-tax amount, add tax, then tip. Tip can sit on the pre-tax figure or on the taxed total — a common restaurant vs receipt ambiguity. The stage is a stacked receipt you can scrub band by band.',
        math: {
          eq: [
            'tax = subtotal × (tax% ÷ 100)',
            'tipBase = subtotal  or  subtotal + tax',
            'tip = tipBase × (tip% ÷ 100)',
            'grand = subtotal + tax + tip'
          ],
          explain: 'Tax is always a percent of the pre-tax subtotal. Tip percent multiplies either that same subtotal (pre-tax) or the taxed amount (subtotal + tax), depending on the tip-on control. Grand total stacks all three.'
        },
        use: [
          'Enter subtotal and tax %; pick tip and whether it applies pre-tax or after tax.',
          'Scrub each receipt band on the stage.'
        ]
      }
    },
    {
      id: 'invoice', label: 'invoice', blurb: 'lines · due', group: 'money', paths: ['invoice'], icon: I.invoice, status: 'live',
      help: {
        lead: 'Build a local invoice from line items.',
        body: 'Name the parties, add up to four lines (description × qty × rate), then optional discount and tax. The face is total due; the stage is a printable sheet (or amount bands). Copy pastes a plain-text invoice; print uses the browser print dialog.',
        math: {
          eq: [
            'line = qty × rate',
            'subtotal = Σ lines',
            'discount = $  or  subtotal × (disc% ÷ 100)',
            'tax = (subtotal − discount) × (tax% ÷ 100)',
            'due = subtotal − discount + tax'
          ],
          explain: 'Each line is quantity times unit rate. Sum the lines for the subtotal. Discount subtracts either a flat dollar amount or a percent of that subtotal (disc as). Tax applies to what’s left after discount. Total due is the taxed remainder.'
        },
        use: [
          'Fill from / to and meta, then edit line rows.',
          'Scrub quantity on the sheet; tax and discount scrub on their total rows.',
          'Use copy for plain text, pdf for a Save-as-PDF print dialog.'
        ]
      }
    },
    {
      id: 'unit', label: 'unit', blurb: 'cups · grams', group: 'convert', paths: ['unit'], icon: I.unit, status: 'live',
      help: {
        lead: 'Kitchen unit conversions with density.',
        body: 'Convert between volume and weight using an ingredient density. Twin vessels stay linked — change one side and the other follows across the density bridge.',
        math: {
          eq: [
            'grams = amount × factor(from)',
            'out = grams ÷ factor(to)',
            'vol→mass: factor = ml/unit × density'
          ],
          explain: 'Everything routes through grams. Pure mass units (g, oz, lb) scale by fixed factors. Volume units (cup, tbsp, tsp, ml) become grams via milliliters × density (g/ml). Flip the same factors to leave grams for the target unit. Density only matters when one side is volume and the other is mass.'
        },
        use: [
          'Pick units on each side and type an amount.',
          'Choose an ingredient (or density) so cups ↔ grams stay honest.',
          'Scrub either vessel; the partner updates.'
        ]
      }
    },
    {
      id: 'dose', label: 'dose', blurb: 'mix · dilute', group: 'convert', paths: ['dose'], icon: I.dose, status: 'live',
      help: {
        lead: 'Dilution ratios for kitchen and garden mixes.',
        body: 'Not medical dosing — concentrate + water (or carrier) into a target mix. Split panes or a diminishing drop trail show how strong the result is.',
        math: {
          eq: [
            'concentrate = batch × (target% ÷ have%)',
            'diluent = batch − concentrate'
          ],
          explain: 'Same idea as C₁V₁ = C₂V₂: the amount of concentrate needed is the batch volume times how much weaker the target is than what’s in the bottle. Diluent fills the rest of the batch. Not for medicines — kitchen and garden mixes only.'
        },
        use: [
          'Set concentrate strength, target strength, and batch size.',
          'Read how much concentrate and how much diluent to combine.',
          'Scrub the stage to feel the dilution fall off.'
        ]
      }
    },
    {
      id: 'bitrate', label: 'bandwidth', blurb: 'size ÷ speed', group: 'convert', paths: ['bitrate'], icon: I.bandwidth, status: 'live',
      help: {
        lead: 'Rough wall-clock time to move a file.',
        body: 'File size ÷ transfer speed ≈ download (or upload) duration. Units flex across MB/GB and Mbps/MB/s. The stage is a transfer river of packets with an ETA clock.',
        math: {
          eq: [
            'MB = size  or  size × 1024 (if GB)',
            'Mbps = speed  or  speed × 1000 (if Gbps)',
            'seconds = (MB × 8) ÷ Mbps'
          ],
          explain: 'Megabytes become megabits by ×8 (eight bits per byte). Divide by link speed in megabits per second for a rough transfer time. GB and Gbps just scale the inputs first. Ignores protocol overhead — a ceiling estimate, not a promise.'
        },
        use: [
          'Enter size and speed; the face is elapsed wall time.',
          'Scrub either input on the stage; watch the river and ETA move.'
        ]
      }
    },
    {
      id: 'scalemap', label: 'scale', blurb: 'map legend', group: 'convert', paths: ['scalemap'], icon: I.scalemap, status: 'live',
      help: {
        lead: 'Turn a map legend into real-world distance.',
        body: 'Read the printed scale (e.g. 1:24,000 or a bar), measure a length on the map, and get ground distance. Distance rings and a true scale bar keep the ratio visible.',
        math: {
          eq: 'ground = inches_on_map × (real units per inch)',
          explain: 'The legend tells you how many real miles (or km) sit in one inch of paper. Multiply that by how many inches you measured on the map. Switching units only rescales the answer — the ratio itself doesn’t change.'
        },
        use: [
          'Set the map scale, pick miles or km, and measure a length on paper.',
          'The face shows real distance; scrub to explore nearby lengths.'
        ]
      }
    },
    {
      id: 'pace', label: 'pace', blurb: 'distance · eta', group: 'convert', paths: ['pace'], icon: I.pace, status: 'live',
      help: {
        lead: 'Distance × pace → finish time (or solve for pace).',
        body: 'For runs, rides, and hikes: enter distance and pace to get ETA, or lock a finish and back into pace. Route ticks teach distance; tick spacing teaches pace; the finish mark is the ETA.',
        math: {
          eq: [
            'finish_hours = (distance × pace_min) ÷ 60',
            'pace_min = (finish_hours × 60) ÷ distance'
          ],
          explain: 'Pace is minutes per unit (mile or km). Multiply by distance for total minutes, then ÷60 for hours. Flip it when you know the finish clock: minutes available divided by distance is the pace you must hold.'
        },
        use: [
          'Pick solve mode (finish time or needed pace), then fill the other fields.',
          'Scrub the route stage — spacing tightens as pace quickens.'
        ]
      }
    },
    {
      id: 'ratio', label: 'ratio', blurb: 'aspect · gold', group: 'form', paths: ['ratio'], icon: I.ratio, status: 'live',
      help: {
        lead: 'Explore aspect ratios by dragging a rectangle.',
        body: 'Width ÷ height updates live as you reshape the frame. Optional thirds and golden-section guides help composition; preset locks snap common film and screen ratios.',
        math: {
          eq: 'ratio = width ÷ height',
          explain: 'That’s the whole instrument. 16:9 ≈ 1.778, 4:5 = 0.8, φ ≈ 1.618. Presets just snap width to height × that constant; guides are visual only and don’t change the number.'
        },
        use: [
          'Drag the stage rectangle; numbers follow.',
          'Lock a preset (16:9, 4:5, φ…) to snap scrub.',
          'Toggle guides in settings.'
        ]
      }
    },
    {
      id: 'typescale', label: 'type', blurb: 'modular scale', group: 'form', paths: ['typescale'], icon: I.typescale, status: 'live',
      help: {
        lead: 'Build a modular type scale from a base size.',
        body: 'Base × ratio raises a ladder of steps (major third, perfect fourth, golden…). The stage shows the vertical scale with live specimen lines so hierarchy is felt, not just listed.',
        math: {
          eq: 'sizeᵢ = base × ratioⁱ',
          explain: 'Each step multiplies (or divides) by the same ratio. i = 0 is the base; positive steps grow, negative steps shrink. Classic ratios: major third ≈ 1.25, perfect fourth ≈ 1.333, golden ≈ 1.618.'
        },
        use: [
          'Set base px and ratio; steps fill automatically.',
          'Scrub base or ratio on the face / ladder.',
          'Copy sizes into a design system or CSS tokens.'
        ]
      }
    },
    {
      id: 'exposure', label: 'exposure', blurb: 'iso · shutter', group: 'form', paths: ['exposure'], icon: I.exposure, status: 'live',
      help: {
        lead: 'Balance ISO, aperture, and shutter as exposure value.',
        body: 'The exposure triangle: change one stop and see what the others must do to hold EV. Sunny-16 is the daylight reference baked into the instrument.',
        math: {
          eq: [
            'EV = log₂(N² ÷ t) − log₂(ISO ÷ 100)',
            'sunny 16 ≈ EV 15'
          ],
          explain: 'N is the f-number, t is shutter time in seconds. Doubling ISO adds one stop (subtracts 1 from EV in this form). Sunny-16 — ƒ/16, 1/ISO shutter at ISO 100 — sits near EV 15; the face shows how far your triangle sits from that daylight mark.'
        },
        use: [
          'Scrub ISO, f-stop, or shutter; EV holds or follows per mode.',
          'Use the triangle stage to feel stop-for-stop tradeoffs.'
        ]
      }
    },
    {
      id: 'contrast', label: 'contrast', blurb: 'fg · bg · wcag', group: 'form', paths: ['contrast'], icon: I.contrast, status: 'live',
      help: {
        lead: 'Check text contrast against WCAG bands.',
        body: 'Pick foreground and background hex colors. The face is the contrast ratio; pass/fail bands for AA / AAA update with it. Choose normal or large text for the WCAG rules that apply.',
        math: {
          eq: [
            'L = 0.2126 R + 0.7152 G + 0.0722 B',
            'contrast = (L_light + 0.05) ÷ (L_dark + 0.05)'
          ],
          explain: 'R, G, B are sRGB channels linearized first (the WCAG gamma step). L is relative luminance. Contrast is the lighter L over the darker L, each padded by 0.05. Normal text needs 4.5:1 for AA and 7:1 for AAA; large text relaxes to 3:1 and 4.5:1.'
        },
        use: [
          'Enter or scrub fg / bg hex values.',
          'Pick text size (normal / large) for the right WCAG rungs.',
          'Read the ratio and which bands clear.'
        ]
      }
    },
    {
      id: 'odds', label: 'odds', blurb: 'avg · bet', group: 'chance', paths: ['odds'], icon: I.odds, status: 'live',
      help: {
        lead: 'Average dollars each time you take a bet.',
        body: 'Not a bookmaker’s odds line — the long-run average: win % of the win $, plus lose % of the lose $ (usually a negative stake). Above zero means the bet pays you over many plays.',
        math: {
          eq: 'EV = p × win + (1 − p) × lose',
          explain: 'p is win chance as a fraction. Multiply it by what you get when you win, and the complement by what you get when you lose (usually a negative stake). The sum is expected value — average dollars per play if you repeated the bet forever.'
        },
        use: [
          'Enter win chance, dollars if you win, and dollars if you lose.',
          'Try a preset, then scrub chance and watch the seesaw tip.'
        ]
      }
    },
    {
      id: 'combo', label: 'combo', blurb: 'ways to pick', group: 'chance', paths: ['combo'], icon: I.combo, status: 'live',
      help: {
        lead: 'How many distinct groups can you draw from a pile?',
        body: 'Order does not matter — a poker hand is the same cards whether you were dealt them left-to-right or not. The stage lights the picks so the count is visible.',
        math: {
          eq: 'C(n, k) = n! ÷ (k! × (n − k)!)',
          explain: 'Combinations: how many ways to choose k items from n when order doesn’t matter. The page multiplies stepwise — ∏ᵢ (n − k + i) ÷ i — to avoid huge factorials, then rounds. If k > n the answer is zero.'
        },
        use: [
          'Set from (pile size) and pick (how many).',
          'Try poker / lotto / team presets; scrub to explore.'
        ]
      }
    },
    {
      id: 'deal', label: 'deal', blurb: 'next card', group: 'chance', paths: ['deal'], icon: I.deal, status: 'live',
      help: {
        lead: 'Chance the next card is one you still want.',
        body: 'As the deck shrinks, count cards left and how many of those are still wanted. Lit cards on the grid are the ones you care about.',
        math: {
          eq: [
            'P(next) = want ÷ left',
            '≈ 1 in (left ÷ want)'
          ],
          explain: 'Uniform draw from what’s left: wanted cards over cards remaining. “1 in …” is just the reciprocal, rounded for the caption. No card-counting model beyond that simple fraction.'
        },
        use: [
          'Set left and want (wanted cards still in the deck).',
          'Presets snap common cases: aces, a suit, tens+, a short shoe.'
        ]
      }
    },
    {
      id: 'sample', label: 'sample', blurb: 'poll · ±', group: 'chance', paths: ['sample'], icon: I.sample, status: 'live',
      help: {
        lead: 'How far might a poll miss the real share?',
        body: 'Enter how many people you asked and the yes %. The face is a ballpark ± margin. More people tighten it. Rule of thumb — not a full survey design.',
        math: {
          eq: 'MoE ≈ z × √(p(1 − p) ÷ n)',
          explain: 'Wald margin for a proportion: z comes from the confidence level (1.96 ≈ 95%). p is the observed yes share, n the sample size. Square root shrinks as n grows. This ignores design effects, clustering, and finite populations — a classroom rule of thumb, not a survey report.'
        },
        use: [
          'Enter sample size and estimated share; pick confidence on the page.',
          'Read ± margin on the face; scrub size to watch the band tighten.'
        ]
      }
    },
    {
      id: 'streak', label: 'streak', blurb: 'still the same', group: 'chance', paths: ['streak'], icon: I.streak, status: 'live',
      help: {
        lead: 'A streak does not make the next flip “due.”',
        body: 'Independent flips: past heads do not raise the chance of tails. The face stays on the next flip’s chance — unchanged — while the caption shows how rare that run was.',
        math: {
          eq: [
            'P(next) = p  (unchanged)',
            'P(run of r) = pʳ'
          ],
          explain: 'Independence means the streak doesn’t update the next flip — the face is still p. The run probability pʳ only describes how surprising the history was, not what comes next. No gambler’s fallacy baked in.'
        },
        use: [
          'Set heads % and how many you’ve seen in a row.',
          'Read “next flip still…” under the face.'
        ]
      }
    },
    {
      id: 'bayes', label: 'bayes', blurb: 'before → after', group: 'chance', paths: ['bayes'], icon: I.bayes, status: 'live',
      help: {
        lead: 'How much should this evidence change your mind?',
        body: 'Before = how likely the claim seemed. When true / when false = how often you’d see this evidence in each world. The face is your belief after seeing it.',
        math: {
          eq: [
            'P(H|E) = P(E|H)·P(H) ÷ [P(E|H)·P(H) + P(E|¬H)·P(¬H)]',
            'LR = P(E|H) ÷ P(E|¬H)'
          ],
          explain: 'Classic Bayes for a yes/no claim. Prior P(H) is “before.” Hit rate P(E|H) and false-alarm rate P(E|¬H) weight how often the evidence shows up in each world. The denominator is total chance of seeing the evidence; the face is the updated belief. Likelihood ratio is how many times more often the evidence appears when the claim is true.'
        },
        use: [
          'Enter before %, when true %, and when false %.',
          'Try lab test or rare disease; scrub to feel sensitivity.',
          'Handy for tests, filters, and “should this update me?”'
        ]
      }
    }
  ];

  function toolById(id) {
    for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].id === id) return TOOLS[i];
    return null;
  }

  function pathTouches(path, seg) {
    if (!seg) return false;
    return (
      path === '/' + seg ||
      path === '/' + seg + '/' ||
      path.indexOf('/' + seg + '/') >= 0 ||
      path.endsWith('/' + seg) ||
      path.endsWith('/' + seg + '/index.html')
    );
  }

  function detectToolId() {
    var path = (global.location && global.location.pathname) || '';
    var i, j;
    if (pathTouches(path, 'tools')) return 'tools';
    // Longer path segments first so /wordcount wins over /count, etc.
    var ranked = TOOLS.slice().sort(function (a, b) {
      return (b.paths[0] || '').length - (a.paths[0] || '').length;
    });
    for (i = 0; i < ranked.length; i++) {
      for (j = 0; j < ranked[i].paths.length; j++) {
        if (pathTouches(path, ranked[i].paths[j])) return ranked[i].id;
      }
    }
    if (/\/index\.html?$/.test(path) || path.endsWith('/') || path === '') return 'wordcount';
    return 'wordcount';
  }

  function suiteRoot() {
    var path = (global.location && global.location.pathname) || '/';
    var segments = path.split('/').filter(Boolean);
    var i, j, idx;
    var toolsIdx = segments.indexOf('tools');
    if (toolsIdx >= 0) return '/' + segments.slice(0, toolsIdx).join('/');
    for (i = 0; i < TOOLS.length; i++) {
      for (j = 0; j < TOOLS[i].paths.length; j++) {
        idx = segments.indexOf(TOOLS[i].paths[j]);
        if (idx >= 0) return '/' + segments.slice(0, idx).join('/');
      }
    }
    var last = segments[segments.length - 1] || '';
    if (/\.html?$/i.test(last)) segments.pop();
    return segments.length ? '/' + segments.join('/') : '';
  }

  function isProductionHost() {
    var host = (global.location && global.location.hostname) || '';
    return /(^|\.)ibm\.io$/i.test(host) || /\.workers\.dev$/i.test(host);
  }

  function hasNamedToolPath() {
    var path = (global.location && global.location.pathname) || '/';
    return TOOLS.some(function (t) {
      return t.paths.some(function (p) { return pathTouches(path, p); });
    }) && pathTouches(path, 'wordcount');
  }

  function toolHref(tool) {
    var loc = global.location || {};
    var path = loc.pathname || '';
    var here = detectToolId();
    var seg = tool.paths[0];

    if (loc.protocol === 'file:') {
      if (tool.id === 'wordcount') return here === 'wordcount' ? 'index.html' : '../index.html';
      if (here === 'wordcount') return seg + '/index.html';
      if (here === 'tools') return '../' + seg + '/index.html';
      if (here === tool.id) return 'index.html';
      return '../' + seg + '/index.html';
    }

    if (isProductionHost() || hasNamedToolPath()) {
      var root = suiteRoot();
      if (!root || root === '/') return '/' + seg + '/';
      return root + '/' + seg + '/';
    }

    // Local python http.server from repo root: words at /, others at /{id}/
    if (tool.id === 'wordcount') {
      return here === 'wordcount' ? './' : '../';
    }
    if (here === 'wordcount') return seg + '/';
    if (here === 'tools') return '../' + seg + '/';
    if (here === tool.id) return './';
    return '../' + seg + '/';
  }

  function toolsMapHref() {
    var loc = global.location || {};
    var here = detectToolId();
    if (loc.protocol === 'file:') {
      return here === 'wordcount' ? 'tools/index.html' : here === 'tools' ? 'index.html' : '../tools/index.html';
    }
    if (isProductionHost() || hasNamedToolPath()) {
      var root = suiteRoot();
      if (!root || root === '/') return '/tools/';
      return root + '/tools/';
    }
    if (here === 'wordcount') return 'tools/';
    if (here === 'tools') return './';
    return '../tools/';
  }

  function injectStyles() {
    var css = [
      /* Surreptitious tools cluster: look (theme/info/settings) + grid, top-right. */
      '.suite-nav{position:fixed;top:max(10px,env(safe-area-inset-top));right:max(10px,env(safe-area-inset-right));z-index:210;font:400 11px/1.25 var(--ui,Helvetica,Arial,sans-serif);color:var(--mute,#757575);pointer-events:none}',
      '.suite-nav.is-open{z-index:240}',
      'body.settings-open .suite-nav{z-index:240}',
      'body.help-open .suite-nav{z-index:220}',
      '.suite-nav-inner{pointer-events:auto;display:flex;flex-direction:column;align-items:flex-end;gap:0}',
      '.suite-nav-bar{display:flex;align-items:center;justify-content:flex-end;gap:2px;position:relative;z-index:2}',
      '.suite-chrome{display:flex;align-items:center;gap:2px}',
      '.suite-chrome:empty{display:none}',
      '.suite-nav-btn,.suite-help-btn,.suite-chrome #themeBtn,.suite-chrome #settingsToggle{position:relative;width:auto;min-width:44px;min-height:44px;height:44px;padding:0 10px;border:0;background:transparent;color:inherit;cursor:pointer;opacity:.38;transition:opacity .2s ease,color .2s ease;display:inline-flex;align-items:center;justify-content:center;touch-action:manipulation;border-radius:2px;font:inherit;font-size:11px;letter-spacing:.04em;line-height:1}',
      '.suite-nav-btn,.suite-help-btn{width:44px;padding:0}',
      '.suite-chrome #themeBtn{width:44px;padding:0}',
      '.suite-nav-btn::before,.suite-help-btn::before,.suite-chrome #themeBtn::before,.suite-chrome #settingsToggle::before{content:"";position:absolute;inset:8px;border-radius:2px;background:color-mix(in srgb,var(--bg,#f2f2f0) 88%,transparent);z-index:-1}',
      '.suite-nav:hover .suite-nav-btn,.suite-nav.is-open .suite-nav-btn,.suite-nav-btn:focus-visible,.suite-nav:hover .suite-help-btn,.suite-nav.is-help-open .suite-help-btn,.suite-help-btn:focus-visible,.suite-nav:hover .suite-chrome #themeBtn,.suite-nav:hover .suite-chrome #settingsToggle,.suite-chrome #themeBtn:focus-visible,.suite-chrome #settingsToggle:focus-visible,.suite-chrome #themeBtn:hover,.suite-chrome #settingsToggle:hover{opacity:.95;color:var(--ink,#111)}',
      '.suite-nav:hover .suite-nav-btn::before,.suite-nav.is-open .suite-nav-btn::before,.suite-nav-btn:focus-visible::before,.suite-nav:hover .suite-help-btn::before,.suite-nav.is-help-open .suite-help-btn::before,.suite-help-btn:focus-visible::before,.suite-nav:hover .suite-chrome #themeBtn::before,.suite-nav:hover .suite-chrome #settingsToggle::before,.suite-chrome #themeBtn:focus-visible::before,.suite-chrome #settingsToggle:focus-visible::before,.suite-chrome #themeBtn:hover::before,.suite-chrome #settingsToggle:hover::before{background:color-mix(in srgb,var(--face,#fafaf8) 92%,var(--bg,#f2f2f0))}',
      '.suite-nav-btn:focus-visible,.suite-help-btn:focus-visible,.suite-chrome #themeBtn:focus-visible,.suite-chrome #settingsToggle:focus-visible{outline:1px solid var(--accent,#c45c26);outline-offset:2px;opacity:1}',
      '.suite-nav-btn svg,.suite-help-btn svg{display:block;width:12px;height:12px}',
      '.suite-chrome .theme-orb{display:block;width:10px;height:10px;border:1.25px solid currentColor;border-radius:50%;background:none;box-sizing:border-box}',
      '.suite-chrome #settingsToggle{max-width:5.2rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.suite-nav-panel{display:none;margin:8px 0 0;width:min(292px,calc(100vw - 24px));max-height:min(72vh,calc(100dvh - 64px));overflow:auto;overscroll-behavior:contain;padding:10px 10px 12px;box-sizing:border-box;background:color-mix(in srgb,var(--face,#fafaf8) 96%,var(--ink,#111) 4%);border:1px solid var(--hair,#e4e4e0);scrollbar-width:thin;box-shadow:0 8px 28px color-mix(in srgb,var(--ink,#111) 12%,transparent)}',
      '.suite-nav.is-open .suite-nav-panel{display:block}',
      '.suite-group{margin:0 0 10px}',
      '.suite-group:last-child{margin-bottom:0}',
      '.suite-group-label{display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute,#757575);opacity:.7;padding:2px 4px 6px}',
      '.suite-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin:0;padding:0;list-style:none}',
      '.suite-tile{display:flex;flex-direction:column;align-items:flex-start;gap:3px;padding:8px 7px 7px;min-height:58px;text-decoration:none;color:var(--mute,#757575);border:1px solid transparent;border-radius:2px;transition:color .15s ease,background .15s ease,border-color .15s ease;position:relative}',
      '.suite-tile:hover,.suite-tile:focus-visible{color:var(--ink,#111);background:color-mix(in srgb,var(--hair,#e4e4e0) 55%,transparent);outline:1px solid var(--accent,#c45c26);outline-offset:-1px;border-color:var(--hair,#e4e4e0)}',
      '.suite-tile[aria-current="page"]{color:var(--accent,#c45c26);border-color:color-mix(in srgb,var(--accent,#c45c26) 35%,var(--hair,#e4e4e0))}',
      '.suite-tile.is-soon{opacity:.55}',
      '.suite-tile.is-soon:hover,.suite-tile.is-soon:focus-visible{opacity:.85}',
      '.suite-tile svg{width:14px;height:14px;display:block;flex-shrink:0}',
      '.suite-tile-label{font-size:11px;letter-spacing:.04em;text-transform:lowercase;line-height:1.1}',
      '.suite-tile-blurb{font-size:9px;letter-spacing:.02em;line-height:1.25;opacity:.75;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.suite-tile-soon{position:absolute;top:5px;right:5px;font-size:7px;letter-spacing:.08em;text-transform:uppercase;opacity:.7}',
      '.suite-map-link{display:block;margin:4px 4px 0;padding:8px 6px;text-align:center;text-decoration:none;color:var(--mute,#757575);font-size:10px;letter-spacing:.1em;text-transform:uppercase;border-top:1px solid var(--hair,#e4e4e0)}',
      '.suite-map-link:hover,.suite-map-link:focus-visible{color:var(--ink,#111);outline:1px solid var(--accent,#c45c26);outline-offset:-1px}',
      '.suite-map-link[aria-current="page"]{color:var(--accent,#c45c26)}',
      /* Right-side help drawer — above suite chrome while open */
      '.suite-help-backdrop{position:fixed;inset:0;z-index:245;background:color-mix(in srgb,var(--ink,#111) 22%,transparent);opacity:0;pointer-events:none;transition:opacity .22s ease}',
      'body.help-open .suite-help-backdrop{opacity:1;pointer-events:auto}',
      '.suite-help{position:fixed;top:0;right:0;bottom:0;z-index:250;width:min(420px,100vw);max-width:100%;box-sizing:border-box;background:color-mix(in srgb,var(--face,#fafaf8) 97%,var(--ink,#111) 3%);border-left:1px solid var(--hair,#e4e4e0);box-shadow:-12px 0 40px color-mix(in srgb,var(--ink,#111) 14%,transparent);transform:translateX(104%);transition:transform .28s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;font:400 13px/1.45 var(--ui,Helvetica,Arial,sans-serif);color:var(--ink,#111);outline:none}',
      'body.help-open .suite-help{transform:none}',
      '@media (prefers-reduced-motion:reduce){.suite-help,.suite-help-backdrop{transition:none}}',
      '.suite-help-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:max(18px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) 14px max(20px,env(safe-area-inset-left));border-bottom:1px solid var(--hair,#e4e4e0);flex:0 0 auto}',
      '.suite-help-kicker{display:block;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute,#757575);margin:0 0 6px}',
      '.suite-help-title{margin:0;font:500 1.35rem/1.2 var(--ui,Helvetica,Arial,sans-serif);letter-spacing:.02em;text-transform:lowercase}',
      '.suite-help-blurb{margin:6px 0 0;font-size:12px;color:var(--mute,#757575);letter-spacing:.02em}',
      '.suite-help-close{flex:0 0 auto;width:44px;height:44px;margin:-8px -4px 0 0;border:0;background:transparent;color:var(--mute,#757575);cursor:pointer;border-radius:2px;display:inline-flex;align-items:center;justify-content:center;font:inherit;font-size:18px;line-height:1}',
      '.suite-help-close:hover,.suite-help-close:focus-visible{color:var(--ink,#111);outline:1px solid var(--accent,#c45c26);outline-offset:2px}',
      '.suite-help-body{flex:1 1 auto;overflow:auto;overscroll-behavior:contain;padding:18px max(20px,env(safe-area-inset-right)) max(28px,env(safe-area-inset-bottom)) max(20px,env(safe-area-inset-left));scrollbar-width:thin}',
      '.suite-help-lead{margin:0 0 12px;font-size:15px;line-height:1.4;font-weight:500;letter-spacing:.01em}',
      '.suite-help-copy{margin:0 0 18px;color:var(--mute,#757575);font-size:13px;line-height:1.55}',
      '.suite-help-math{margin:0 0 20px;padding:12px 14px;border:1px solid var(--hair,#e4e4e0);border-radius:2px;background:color-mix(in srgb,var(--bg,#f2f2f0) 70%,var(--face,#fafaf8))}',
      '.suite-help-math .suite-help-label{margin:0 0 10px}',
      '.suite-help-eq{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;font:500 13px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.01em;color:var(--ink,#111);overflow-wrap:anywhere}',
      '.suite-help-eq li{margin:0}',
      '.suite-help-eq-single{margin:0;font:500 13px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.01em;color:var(--ink,#111);overflow-wrap:anywhere}',
      '.suite-help-math-explain{margin:10px 0 0;font-size:12px;line-height:1.55;color:var(--mute,#757575)}',
      '.suite-help-live{margin:12px 0 0;padding:10px 12px;border-radius:2px;background:color-mix(in srgb,var(--ink,#111) 4%,var(--face,#fafaf8));border:1px dashed color-mix(in srgb,var(--accent,#c45c26) 45%,var(--hair,#e4e4e0))}',
      '.suite-help-live .suite-help-label{margin:0 0 8px;color:var(--accent,#c45c26);opacity:1}',
      '.suite-help-live-eq{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px;font:500 12px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.01em;color:var(--ink,#111);overflow-wrap:anywhere}',
      '.suite-help-live-eq li{margin:0}',
      '.suite-help-live-empty{margin:0;font-size:12px;color:var(--mute,#757575);line-height:1.45}',
      '.suite-help-label{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute,#757575);opacity:.75;margin:0 0 8px}',
      '.suite-help-list{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px}',
      '.suite-help-list li{position:relative;padding:0 0 0 14px;font-size:13px;line-height:1.5;color:var(--ink,#111)}',
      '.suite-help-list li::before{content:"";position:absolute;left:0;top:.55em;width:5px;height:5px;border-radius:1px;background:var(--accent,#c45c26)}',
      '.suite-help-foot{margin:22px 0 0;padding-top:14px;border-top:1px solid var(--hair,#e4e4e0);font-size:11px;line-height:1.5;color:var(--mute,#757575)}',
      '.suite-help-icon{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;margin:0 0 10px;color:var(--accent,#c45c26)}',
      '.suite-help-icon svg{width:18px;height:18px}',
      /* Title only in masthead — chrome lives in .suite-nav */
      'header.masthead,.masthead{z-index:200}',
      'header.masthead .actions:empty,.masthead .actions:empty{display:none}',
      'body.help-open{overflow:hidden}'
    ].join('');
    var el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = css;
  }

  /** Move theme + settings into the tools cluster (IDs + listeners preserved). */
  function adoptSuiteChrome(nav) {
    if (!nav) return;
    var chrome = nav.querySelector('.suite-chrome');
    if (!chrome) return;
    var theme = document.getElementById('themeBtn');
    var settings = document.getElementById('settingsToggle');
    var helpBtn = chrome.querySelector('.suite-help-btn');
    /* Order: theme · info · settings */
    if (theme && !chrome.contains(theme)) chrome.insertBefore(theme, helpBtn || null);
    if (settings && !chrome.contains(settings)) chrome.appendChild(settings);
    if (theme && !theme._ibmHelpCloseBound) {
      theme._ibmHelpCloseBound = true;
      theme.addEventListener('click', function () { closeHelp(); }, true);
    }
    if (settings && !settings._ibmHelpCloseBound) {
      settings._ibmHelpCloseBound = true;
      settings.addEventListener('click', function () { closeHelp(); }, true);
    }
    /* Drop empty masthead action rails so title can breathe */
    document.querySelectorAll('header.masthead .actions, header .actions, .masthead .actions').forEach(function (el) {
      if (!el.children.length) el.remove();
    });
  }

  function iconSvg(tool) {
    return '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">' +
      (tool.icon || '') + '</svg>';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function helpFor(id) {
    if (id === 'tools') {
      return { label: 'tools', blurb: 'suite map', icon: I.tools, help: MAP_HELP };
    }
    var tool = toolById(id);
    if (!tool) return null;
    return tool;
  }

  function closeSettingsShell() {
    if (!document.body.classList.contains('settings-open')) return;
    document.body.classList.remove('settings-open');
    var st = document.getElementById('settingsToggle');
    var settingsPanel = document.getElementById('settings');
    if (st) {
      st.setAttribute('aria-expanded', 'false');
      if (st.textContent === 'close') st.textContent = 'settings';
    }
    if (settingsPanel) {
      settingsPanel.setAttribute('hidden', '');
      settingsPanel.classList.remove('open');
    }
  }

  function closeSuiteNav() {
    var suite = document.querySelector('.suite-nav.is-open');
    if (suite) suite.classList.remove('is-open');
    var suiteBtn = document.querySelector('.suite-nav-btn');
    if (suiteBtn) suiteBtn.setAttribute('aria-expanded', 'false');
    var suitePanel = document.querySelector('.suite-nav-panel');
    if (suitePanel) suitePanel.setAttribute('hidden', '');
  }

  function isHelpOpen() {
    return document.body.classList.contains('help-open');
  }

  function closeHelp() {
    if (!isHelpOpen()) return;
    unbindHelpLive();
    if (helpLiveTick) { clearInterval(helpLiveTick); helpLiveTick = null; }
    helpLiveId = null;
    document.body.classList.remove('help-open');
    var nav = document.querySelector('.suite-nav');
    if (nav) nav.classList.remove('is-help-open');
    var btn = document.getElementById('suiteHelpBtn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    var panel = document.getElementById('suiteHelp');
    if (panel) panel.setAttribute('hidden', '');
    var backdrop = document.getElementById('suiteHelpBackdrop');
    if (backdrop) backdrop.setAttribute('hidden', '');
    if (btn && document.activeElement && panel && panel.contains(document.activeElement)) {
      try { btn.focus(); } catch (err) {}
    }
  }


  var helpLiveId = null;
  var helpLiveBound = false;
  var helpLiveTick = null;

  function elVal(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }
  function numVal(id, fallback) {
    var n = parseFloat(elVal(id));
    return isFinite(n) ? n : (fallback == null ? 0 : fallback);
  }
  function intVal(id, fallback) {
    var n = parseInt(elVal(id), 10);
    return isFinite(n) ? n : (fallback == null ? 0 : fallback);
  }
  function fmtNum(n, digits) {
    if (!isFinite(n)) return '—';
    var d = digits == null ? 2 : digits;
    var s = Number(n).toFixed(d);
    if (d > 0) s = s.replace(/\.?0+$/, '');
    return s;
  }
  function fmtMoney(n) {
    if (!isFinite(n)) return '—';
    var neg = n < 0;
    var s = Math.abs(n).toFixed(2);
    return (neg ? '−' : '') + '$' + s;
  }
  function fmtPct(n, digits) {
    return fmtNum(n, digits == null ? 1 : digits) + '%';
  }
  function fmtClockSec(sec) {
    sec = Math.max(0, Math.round(sec));
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    if (h) return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    return m + ':' + String(s).padStart(2, '0');
  }
  function fmtHours(h) {
    return fmtClockSec(h * 3600);
  }
  function chooseN(n, k) {
    n = Math.floor(n); k = Math.floor(k);
    if (k < 0 || n < 0 || k > n) return 0;
    k = Math.min(k, n - k);
    var r = 1;
    for (var i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
    return Math.round(r);
  }
  function parseHexRgb(hex) {
    var h = String(hex || '').replace('#', '').trim();
    if (h.length === 3) {
      return [
        parseInt(h[0] + h[0], 16),
        parseInt(h[1] + h[1], 16),
        parseInt(h[2] + h[2], 16)
      ];
    }
    if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return null;
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16)
    ];
  }
  function linChannel(c) {
    var x = c / 255;
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }
  function lumRgb(rgb) {
    if (!rgb) return 0;
    return 0.2126 * linChannel(rgb[0]) + 0.7152 * linChannel(rgb[1]) + 0.0722 * linChannel(rgb[2]);
  }
  function liftRgb(rgb, delta) {
    return rgb.map(function (c) {
      return Math.max(0, Math.min(255, c + delta * 2.2));
    });
  }
  function countWordsLocal(text) {
    var trimmed = String(text || '').trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }
  function parseLooseDurationMs(raw) {
    var s = String(raw || '').trim().toLowerCase();
    if (!s) return 0;
    var hm = s.match(/^(\d+)\s*h(?:\s*(\d+)\s*m?)?$/);
    if (hm) return ((+hm[1] * 60) + (hm[2] ? +hm[2] : 0)) * 60000;
    var mm = s.match(/^(\d+)\s*m(?:in(?:ute)?s?)?$/);
    if (mm) return +mm[1] * 60000;
    var bare = s.match(/^(\d+(?:\.\d+)?)$/);
    if (bare) return +bare[1] * 60000;
    var colon = s.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
    if (colon) {
      if (colon[3] != null) return ((+colon[1] * 3600) + (+colon[2] * 60) + +colon[3]) * 1000;
      return ((+colon[1] * 60) + +colon[2]) * 1000;
    }
    return 0;
  }
  function fmtMs(ms) {
    ms = Math.max(0, Math.round(ms || 0));
    var totalSec = Math.floor(ms / 1000);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var sec = totalSec % 60;
    if (h) return h + ':' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    return m + ':' + String(sec).padStart(2, '0');
  }

  var LIVE_MATH = {
    wordcount: function () {
      var textEl = document.getElementById('text');
      var words = countWordsLocal(textEl ? textEl.value : '');
      var readingMin = words / 200;
      var speakingMin = words / 130;
      var pages = words / 250;
      return [
        'words = ' + words,
        'reading ≈ ' + words + ' ÷ 200 = ' + fmtNum(readingMin, 2) + ' min',
        'speaking ≈ ' + words + ' ÷ 130 = ' + fmtNum(speakingMin, 2) + ' min',
        'pages ≈ ' + words + ' ÷ 250 = ' + fmtNum(pages, 1)
      ];
    },
    timecount: function () {
      var face = (document.getElementById('faceTime') || {}).textContent || '0:00';
      var targetRaw = elVal('targetInput');
      var limitMs = parseLooseDurationMs(targetRaw);
      var main = document.querySelector('main');
      var mode = (main && main.getAttribute('data-mode')) || 'duration';
      var lines = [
        'face = ' + face.trim() + (mode === 'limit' ? '  ← remaining' : '  ← elapsed')
      ];
      if (targetRaw) {
        lines.push('limit = ' + targetRaw + (limitMs ? ' → ' + fmtMs(limitMs) : ''));
      } else {
        lines.push('limit = —');
      }
      lines.push('remaining = max(0, limit − elapsed)');
      return lines;
    },
    bill: function () {
      var total = Math.max(0, numVal('total'));
      var tipPct = Math.max(0, numVal('tip'));
      var people = Math.max(1, intVal('people', 1));
      var tip = total * tipPct / 100;
      var grand = total + tip;
      var each = grand / people;
      return [
        'tip = ' + fmtMoney(total) + ' × (' + fmtNum(tipPct, 2) + ' ÷ 100) = ' + fmtMoney(tip),
        'grand = ' + fmtMoney(total) + ' + ' + fmtMoney(tip) + ' = ' + fmtMoney(grand),
        'each = ' + fmtMoney(grand) + ' ÷ ' + people + ' = ' + fmtMoney(each)
      ];
    },
    hourly: function () {
      var rate = Math.max(0, numVal('rate'));
      var hpd = Math.max(0, numVal('hpd'));
      var days = Math.max(0, numVal('days'));
      var hours = hpd * days;
      var total = rate * hours;
      var dayRate = rate * hpd;
      return [
        'hours = ' + fmtNum(hpd, 2) + ' × ' + fmtNum(days, 2) + ' = ' + fmtNum(hours, 2),
        'project = ' + fmtMoney(rate) + '/h × ' + fmtNum(hours, 2) + 'h = ' + fmtMoney(total),
        'day rate = ' + fmtMoney(rate) + ' × ' + fmtNum(hpd, 2) + ' = ' + fmtMoney(dayRate)
      ];
    },
    budget: function () {
      var pot = Math.max(0, numVal('pot'));
      var ids = ['live', 'food', 'move', 'fun'];
      var parts = ids.map(function (id) { return Math.max(0, numVal(id)); });
      var used = parts.reduce(function (a, b) { return a + b; }, 0);
      var left = pot - used;
      return [
        'used = ' + parts.map(fmtMoney).join(' + ') + ' = ' + fmtMoney(used),
        'left = ' + fmtMoney(pot) + ' − ' + fmtMoney(used) + ' = ' + fmtMoney(left)
      ];
    },
    fuel: function () {
      var miles = Math.max(0, numVal('miles'));
      var mpg = Math.max(0.01, numVal('mpg', 0.01));
      var price = Math.max(0, numVal('price'));
      var gal = miles / mpg;
      var cost = gal * price;
      var l100 = 235.215 / mpg;
      return [
        'gallons = ' + fmtNum(miles, 1) + ' ÷ ' + fmtNum(mpg, 2) + ' = ' + fmtNum(gal, 2),
        'cost = ' + fmtNum(gal, 2) + ' × ' + fmtMoney(price) + ' = ' + fmtMoney(cost),
        'L/100km ≈ 235.215 ÷ ' + fmtNum(mpg, 2) + ' = ' + fmtNum(l100, 1)
      ];
    },
    tax: function () {
      var sub = Math.max(0, numVal('subtotal'));
      var taxPct = Math.max(0, numVal('tax'));
      var tipPct = Math.max(0, numVal('tip'));
      var onTotal = elVal('tipOn') === 'total';
      var taxAmt = sub * (taxPct / 100);
      var tipBase = onTotal ? sub + taxAmt : sub;
      var tipAmt = tipBase * (tipPct / 100);
      var grand = sub + taxAmt + tipAmt;
      return [
        'tax = ' + fmtMoney(sub) + ' × (' + fmtNum(taxPct, 2) + ' ÷ 100) = ' + fmtMoney(taxAmt),
        'tipBase = ' + (onTotal ? fmtMoney(sub) + ' + ' + fmtMoney(taxAmt) : fmtMoney(sub)) + ' = ' + fmtMoney(tipBase) + (onTotal ? '  (after tax)' : '  (pre-tax)'),
        'tip = ' + fmtMoney(tipBase) + ' × (' + fmtNum(tipPct, 2) + ' ÷ 100) = ' + fmtMoney(tipAmt),
        'grand = ' + fmtMoney(sub) + ' + ' + fmtMoney(taxAmt) + ' + ' + fmtMoney(tipAmt) + ' = ' + fmtMoney(grand)
      ];
    },
    invoice: function () {
      var lines = [];
      var i;
      for (i = 1; i <= 4; i++) {
        var desc = String(elVal('d' + i) || '').trim();
        var qty = Math.max(0, numVal('q' + i));
        var rate = Math.max(0, numVal('r' + i));
        var amt = qty * rate;
        if (!desc && amt <= 0) continue;
        lines.push({ desc: desc || ('L' + i), qty: qty, rate: rate, amt: amt });
      }
      var sub = lines.reduce(function (s, L) { return s + L.amt; }, 0);
      var discRaw = Math.max(0, numVal('discount'));
      var discMode = elVal('discMode') === 'pct' ? 'pct' : 'dollars';
      var discAmt = discMode === 'pct' ? sub * (discRaw / 100) : discRaw;
      if (discAmt > sub) discAmt = sub;
      var taxable = Math.max(0, sub - discAmt);
      var taxPct = Math.max(0, numVal('tax'));
      var taxAmt = taxable * (taxPct / 100);
      var grand = taxable + taxAmt;
      var out = lines.slice(0, 3).map(function (L) {
        return L.desc + ' = ' + fmtNum(L.qty, 2) + ' × ' + fmtMoney(L.rate) + ' = ' + fmtMoney(L.amt);
      });
      if (lines.length > 3) out.push('… +' + (lines.length - 3) + ' more');
      out.push('subtotal = ' + fmtMoney(sub));
      if (discAmt > 0) {
        out.push(
          'discount = ' +
            (discMode === 'pct' ? fmtMoney(sub) + ' × (' + fmtNum(discRaw, 2) + ' ÷ 100)' : fmtMoney(discRaw)) +
            ' = ' + fmtMoney(discAmt)
        );
      }
      if (taxAmt > 0 || taxPct > 0) {
        out.push('tax = ' + fmtMoney(taxable) + ' × (' + fmtNum(taxPct, 2) + ' ÷ 100) = ' + fmtMoney(taxAmt));
      }
      out.push('due = ' + fmtMoney(grand));
      return out;
    },
    unit: function () {
      var ML = { cup: 240, tbsp: 15, tsp: 5, ml: 1 };
      var G_PURE = { g: 1, oz: 28.3495, lb: 453.592 };
      var amount = Math.max(0, numVal('amount'));
      var from = elVal('from') || 'cup';
      var to = elVal('to') || 'g';
      var density = numVal('density', 1) || 1;
      function toGrams(a, u, d) {
        if (G_PURE[u]) return a * G_PURE[u];
        return a * (ML[u] || 1) * d;
      }
      function fromGrams(g, u, d) {
        if (G_PURE[u]) return g / G_PURE[u];
        return g / ((ML[u] || 1) * d);
      }
      var g = toGrams(amount, from, density);
      var out = fromGrams(g, to, density);
      var needsD = (!!ML[from] && !!G_PURE[to]) || (!!G_PURE[from] && !!ML[to]);
      var lines = [
        'grams = ' + fmtNum(amount, 3) + ' ' + from + (needsD ? ' × density ' + fmtNum(density, 3) : '') + ' → ' + fmtNum(g, 3) + ' g',
        'out = ' + fmtNum(g, 3) + ' g → ' + fmtNum(out, out >= 100 ? 0 : out >= 10 ? 1 : 2) + ' ' + to
      ];
      return lines;
    },
    dose: function () {
      var want = Math.max(0, numVal('want'));
      var have = Math.max(0.0001, numVal('have', 0.0001));
      var vol = Math.max(0, numVal('vol'));
      var conc = vol * (want / have);
      var water = Math.max(0, vol - conc);
      return [
        'concentrate = ' + fmtNum(vol, 1) + ' × (' + fmtNum(want, 2) + ' ÷ ' + fmtNum(have, 2) + ') = ' + fmtNum(conc, 1),
        'diluent = ' + fmtNum(vol, 1) + ' − ' + fmtNum(conc, 1) + ' = ' + fmtNum(water, 1)
      ];
    },
    bitrate: function () {
      var size = Math.max(0, numVal('size'));
      var sizeUnit = elVal('sizeUnit') || 'MB';
      var speed = Math.max(0.01, numVal('speed', 0.01));
      var speedUnit = elVal('speedUnit') || 'Mbps';
      var mb = sizeUnit === 'GB' ? size * 1024 : size;
      var mbps = speedUnit === 'Gbps' ? speed * 1000 : speed;
      var sec = (mb * 8) / mbps;
      return [
        'MB = ' + fmtNum(size, 2) + (sizeUnit === 'GB' ? ' × 1024 = ' + fmtNum(mb, 2) : ' ' + sizeUnit),
        'Mbps = ' + fmtNum(speed, 2) + (speedUnit === 'Gbps' ? ' × 1000 = ' + fmtNum(mbps, 2) : ' ' + speedUnit),
        'seconds = (' + fmtNum(mb, 2) + ' × 8) ÷ ' + fmtNum(mbps, 2) + ' = ' + fmtNum(sec, 1) + ' → ' + fmtClockSec(sec)
      ];
    },
    scalemap: function () {
      var units = elVal('units') || 'mi';
      var realIn = Math.max(0, numVal('real'));
      var measure = Math.max(0, numVal('measure'));
      var factor = units === 'km' ? (1 / 0.621371) : 1;
      var out = measure * realIn * factor;
      var unitLabel = units === 'km' ? 'km' : 'mi';
      return [
        'ground = ' + fmtNum(measure, 2) + ' in × ' + fmtNum(realIn, 3) + ' ' + unitLabel + '/in = ' + fmtNum(out, out >= 100 ? 0 : 2) + ' ' + unitLabel
      ];
    },
    pace: function () {
      var d = Math.max(0, numVal('distance'));
      var pace = Math.max(0, numVal('pace'));
      var hours = Math.max(0, numVal('hours'));
      var mode = elVal('mode') || 'eta';
      if (mode === 'pace') {
        var needed = d > 0 ? (hours * 60) / d : 0;
        return [
          'pace = (' + fmtNum(hours, 3) + ' h × 60) ÷ ' + fmtNum(d, 2) + ' = ' + fmtNum(needed, 1) + ' min/u',
          'finish locked at ' + fmtHours(hours)
        ];
      }
      var eta = (d * pace) / 60;
      return [
        'finish = (' + fmtNum(d, 2) + ' × ' + fmtNum(pace, 2) + ') ÷ 60 = ' + fmtNum(eta, 3) + ' h → ' + fmtHours(eta),
        'pace held at ' + fmtNum(pace, 1) + ' min/u'
      ];
    },
    ratio: function () {
      var w = Math.max(1, numVal('w', 1));
      var h = Math.max(1, numVal('h', 1));
      var r = w / h;
      return ['ratio = ' + fmtNum(w, 0) + ' ÷ ' + fmtNum(h, 0) + ' = ' + fmtNum(r, 3)];
    },
    typescale: function () {
      var base = Math.max(1, numVal('base', 16));
      var ratio = numVal('ratio', 1.25) || 1.25;
      var steps = Math.max(3, Math.min(12, intVal('steps', 6)));
      var lines = ['sizeᵢ = ' + fmtNum(base, 0) + ' × ' + fmtNum(ratio, 3) + 'ⁱ'];
      for (var i = -2; i < steps - 2 && i <= 3; i++) {
        lines.push('i=' + i + ' → ' + fmtNum(base * Math.pow(ratio, i), 1) + 'px');
      }
      if (steps - 2 > 4) lines.push('… through i=' + (steps - 3));
      return lines;
    },
    exposure: function () {
      var iso = Math.max(25, numVal('iso', 100));
      var f = Math.max(0.5, numVal('fnum', 1));
      var shutN = Math.max(1, numVal('shut', 1));
      var tt = 1 / shutN;
      var ev = Math.log((f * f) / tt) / Math.LN2 - Math.log(iso / 100) / Math.LN2;
      var sunnyDelta = ev - 15;
      return [
        't = 1/' + fmtNum(shutN, 0) + ' = ' + fmtNum(tt, 4) + 's',
        'EV = log₂(' + fmtNum(f, 2) + '² ÷ ' + fmtNum(tt, 4) + ') − log₂(' + fmtNum(iso, 0) + ' ÷ 100) = ' + fmtNum(ev, 1),
        'vs sunny 16 (EV 15): ' + (sunnyDelta >= 0 ? '+' : '') + fmtNum(sunnyDelta, 1)
      ];
    },
    contrast: function () {
      var lift = numVal('lift');
      var fgP = parseHexRgb(elVal('fg')) || [17, 17, 17];
      var bgP = parseHexRgb(elVal('bg')) || [242, 242, 240];
      var fg = liftRgb(fgP, lift);
      var bg = liftRgb(bgP, -lift * 0.35);
      var L1 = lumRgb(fg);
      var L2 = lumRgb(bg);
      var lighter = Math.max(L1, L2);
      var darker = Math.min(L1, L2);
      var ratio = (lighter + 0.05) / (darker + 0.05);
      var large = elVal('size') === 'large';
      var aaNeed = large ? 3 : 4.5;
      var aaaNeed = large ? 4.5 : 7;
      return [
        'L_fg = ' + fmtNum(L1, 3) + ' · L_bg = ' + fmtNum(L2, 3) + (lift ? '  (lift ' + fmtNum(lift, 0) + ')' : ''),
        'contrast = (' + fmtNum(lighter, 3) + ' + 0.05) ÷ (' + fmtNum(darker, 3) + ' + 0.05) = ' + fmtNum(ratio, 2),
        (ratio >= aaaNeed ? 'AAA' : ratio >= aaNeed ? 'AA' : 'fail') + ' for ' + (large ? 'large' : 'normal') + ' text'
      ];
    },
    odds: function () {
      var p = Math.max(0, Math.min(100, numVal('p'))) / 100;
      var win = numVal('win');
      var lose = numVal('lose');
      var ev = p * win + (1 - p) * lose;
      return [
        'EV = ' + fmtNum(p, 3) + ' × ' + fmtMoney(win) + ' + ' + fmtNum(1 - p, 3) + ' × ' + fmtMoney(lose),
        'EV = ' + fmtMoney(p * win) + ' + ' + fmtMoney((1 - p) * lose) + ' = ' + fmtMoney(ev)
      ];
    },
    combo: function () {
      var n = Math.max(0, intVal('n'));
      var k = Math.max(0, intVal('k'));
      var ways = chooseN(n, k);
      return [
        'C(' + n + ', ' + k + ') = ' + n + '! ÷ (' + k + '! × ' + (n - k) + '!) = ' + ways.toLocaleString('en-US')
      ];
    },
    deal: function () {
      var left = Math.max(1, intVal('left', 1));
      var want = Math.max(0, intVal('want'));
      if (want > left) want = left;
      var pp = want / left;
      var oneIn = want ? left / want : Infinity;
      return [
        'P(next) = ' + want + ' ÷ ' + left + ' = ' + fmtPct(pp * 100, 1),
        want ? '≈ 1 in ' + fmtNum(oneIn, 1) : '≈ 1 in ∞'
      ];
    },
    sample: function () {
      var n = Math.max(1, intVal('n', 1));
      var z = numVal('z', 1.96) || 1.96;
      var p = Math.max(0, Math.min(1, numVal('p', 50) / 100));
      var moe = z * Math.sqrt(p * (1 - p) / n);
      var conf = ({ '1.645': '90%', '1.96': '95%', '2.576': '99%' })[String(z)] || (fmtNum(z, 3) + 'σ');
      return [
        'MoE ≈ ' + fmtNum(z, 3) + ' × √(' + fmtNum(p, 2) + ' × ' + fmtNum(1 - p, 2) + ' ÷ ' + n + ')',
        'MoE ≈ ±' + fmtPct(moe * 100, 1) + '  (' + conf + ')'
      ];
    },
    streak: function () {
      var pct = Math.max(0, Math.min(100, numVal('p')));
      var run = Math.max(0, intVal('run'));
      var p01 = pct / 100;
      var streakP = Math.pow(p01, run);
      return [
        'P(next) = ' + fmtPct(pct, 1) + '  (unchanged by the streak)',
        'P(run of ' + run + ') = (' + fmtNum(p01, 3) + ')^' + run + ' = ' + fmtPct(streakP * 100, streakP < 0.01 ? 3 : 1)
      ];
    },
    bayes: function () {
      var prior = Math.min(1, Math.max(0, numVal('prior') / 100));
      var hit = Math.min(1, Math.max(0, numVal('hit') / 100));
      var miss = Math.min(1, Math.max(0, numVal('miss') / 100));
      var num = hit * prior;
      var den = num + miss * (1 - prior);
      var posterior = den > 0 ? num / den : 0;
      var lr = miss > 0 ? hit / miss : Infinity;
      return [
        'P(H|E) = (' + fmtNum(hit, 3) + ' × ' + fmtNum(prior, 3) + ') ÷ (' + fmtNum(num, 4) + ' + ' + fmtNum(miss * (1 - prior), 4) + ')',
        'P(H|E) = ' + fmtPct(posterior * 100, 1) + '  (was ' + fmtPct(prior * 100, 1) + ')',
        'LR = ' + fmtNum(hit, 3) + ' ÷ ' + fmtNum(miss, 3) + ' = ' + (isFinite(lr) ? fmtNum(lr, 2) + '×' : '∞')
      ];
    }
  };

  // fix streak superscript properly below — patch after


  function liveMathLines(toolId) {
    var hook = global.__ibmMathLive;
    if (typeof hook === 'function') {
      try {
        var fromHook = hook(toolId);
        if (fromHook && fromHook.length) return fromHook;
      } catch (err) {}
    }
    var fn = LIVE_MATH[toolId];
    if (typeof fn !== 'function') return [];
    try {
      var lines = fn();
      return Array.isArray(lines) ? lines.filter(Boolean) : [];
    } catch (err2) {
      return [];
    }
  }

  function renderLiveMathHtml(toolId) {
    var lines = liveMathLines(toolId);
    if (!lines.length) {
      return '<div class="suite-help-live" id="suiteHelpLive"><p class="suite-help-label">with your numbers</p><p class="suite-help-live-empty">Open inputs on the page — the worked example appears here.</p></div>';
    }
    return (
      '<div class="suite-help-live" id="suiteHelpLive">' +
        '<p class="suite-help-label">with your numbers</p>' +
        '<ul class="suite-help-live-eq">' +
          lines.map(function (line) { return '<li>' + escapeHtml(line) + '</li>'; }).join('') +
        '</ul>' +
      '</div>'
    );
  }

  function refreshLiveMath() {
    if (!isHelpOpen() || !helpLiveId) return;
    var box = document.getElementById('suiteHelpLive');
    if (!box) return;
    var tmp = document.createElement('div');
    tmp.innerHTML = renderLiveMathHtml(helpLiveId);
    var next = tmp.firstChild;
    if (next) box.replaceWith(next);
  }

  function onHelpLiveInput() {
    if (!isHelpOpen()) return;
    refreshLiveMath();
  }

  function bindHelpLive() {
    if (helpLiveBound) return;
    helpLiveBound = true;
    document.addEventListener('input', onHelpLiveInput, true);
    document.addEventListener('change', onHelpLiveInput, true);
  }

  function unbindHelpLive() {
    if (!helpLiveBound) return;
    helpLiveBound = false;
    document.removeEventListener('input', onHelpLiveInput, true);
    document.removeEventListener('change', onHelpLiveInput, true);
  }

  function fillHelpPanel(panel, currentId) {
    var entry = helpFor(currentId);
    var help = (entry && entry.help) || MAP_HELP;
    var label = (entry && entry.label) || 'tools';
    var blurb = (entry && entry.blurb) || '';
    var icon = (entry && entry.icon) || I.tools;
    var use = (help && help.use) || [];
    var math = help && help.math;
    var toolId = currentId || detectToolId();
    helpLiveId = toolId;
    var eqs = [];
    if (math && math.eq != null) {
      eqs = Array.isArray(math.eq) ? math.eq : [math.eq];
      eqs = eqs.filter(function (line) { return line != null && String(line).trim() !== ''; });
    }
    var hasLive = toolId !== 'tools' && (!!LIVE_MATH[toolId] || typeof global.__ibmMathLive === 'function');
    var mathHtml = '';
    if (eqs.length || (math && math.explain) || hasLive) {
      var eqBlock = eqs.length === 1
        ? '<p class="suite-help-eq-single">' + escapeHtml(eqs[0]) + '</p>'
        : eqs.length
          ? '<ul class="suite-help-eq">' +
            eqs.map(function (line) { return '<li>' + escapeHtml(line) + '</li>'; }).join('') +
            '</ul>'
          : '';
      mathHtml =
        '<div class="suite-help-math">' +
          '<p class="suite-help-label">the math</p>' +
          eqBlock +
          (hasLive ? renderLiveMathHtml(toolId) : '') +
          (math && math.explain
            ? '<p class="suite-help-math-explain">' + escapeHtml(math.explain) + '</p>'
            : '') +
        '</div>';
    }
    var useHtml = use.length
      ? '<p class="suite-help-label">how to use</p><ul class="suite-help-list">' +
        use.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') +
        '</ul>'
      : '';
    panel.innerHTML =
      '<div class="suite-help-head">' +
        '<div>' +
          '<span class="suite-help-kicker">about</span>' +
          '<h2 class="suite-help-title" id="suiteHelpTitle">' + escapeHtml(label) + '</h2>' +
          (blurb ? '<p class="suite-help-blurb">' + escapeHtml(blurb) + '</p>' : '') +
        '</div>' +
        '<button type="button" class="suite-help-close" id="suiteHelpClose" aria-label="close about">×</button>' +
      '</div>' +
      '<div class="suite-help-body">' +
        '<div class="suite-help-icon" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">' + icon + '</svg></div>' +
        '<p class="suite-help-lead">' + escapeHtml((help && help.lead) || '') + '</p>' +
        '<p class="suite-help-copy">' + escapeHtml((help && help.body) || '') + '</p>' +
        mathHtml +
        useHtml +
        '<p class="suite-help-foot">Local only — nothing leaves this page unless you copy or share a link. Look settings sync across tools.</p>' +
      '</div>';
  }

  function openHelp(currentId) {
    var panel = document.getElementById('suiteHelp');
    var backdrop = document.getElementById('suiteHelpBackdrop');
    var btn = document.getElementById('suiteHelpBtn');
    var nav = document.querySelector('.suite-nav');
    if (!panel || !btn) return;
    closeSuiteNav();
    closeSettingsShell();
    fillHelpPanel(panel, currentId || detectToolId());
    bindHelpLive();
    document.body.classList.add('help-open');
    if (nav) nav.classList.add('is-help-open');
    btn.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('hidden');
    if (backdrop) backdrop.removeAttribute('hidden');
    if (helpLiveTick) {
      clearInterval(helpLiveTick);
      helpLiveTick = null;
    }
    if (helpLiveId === 'timecount' || helpLiveId === 'wordcount') {
      helpLiveTick = setInterval(function () {
        if (!isHelpOpen()) return;
        refreshLiveMath();
      }, 1000);
    }
    var closeBtn = document.getElementById('suiteHelpClose');
    setTimeout(function () {
      try { (closeBtn || panel).focus(); } catch (err) {}
    }, 0);
  }

  function setHelpOpen(open, currentId) {
    if (open) openHelp(currentId);
    else closeHelp();
  }

  function rememberVisit(id) {
    if (!id) return;
    try {
      var raw = localStorage.getItem(SHARED_KEY);
      var data = raw ? JSON.parse(raw) : {};
      if (!data || typeof data !== 'object') data = {};
      var recent = Array.isArray(data.recent) ? data.recent.filter(function (x) { return x !== id; }) : [];
      recent.unshift(id);
      data.recent = recent.slice(0, 8);
      localStorage.setItem(SHARED_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function mountSuiteNav(currentId) {
    injectStyles();
    currentId = currentId || detectToolId();
    rememberVisit(currentId);
    if (document.querySelector('.suite-nav')) {
      adoptSuiteChrome(document.querySelector('.suite-nav'));
      return;
    }

    var nav = document.createElement('nav');
    nav.className = 'suite-nav';
    nav.setAttribute('aria-label', 'tools');

    var inner = document.createElement('div');
    inner.className = 'suite-nav-inner';

    var bar = document.createElement('div');
    bar.className = 'suite-nav-bar';

    var chrome = document.createElement('div');
    chrome.className = 'suite-chrome';
    chrome.setAttribute('role', 'group');
    chrome.setAttribute('aria-label', 'look');

    var helpBtn = document.createElement('button');
    helpBtn.type = 'button';
    helpBtn.className = 'suite-help-btn';
    helpBtn.id = 'suiteHelpBtn';
    helpBtn.setAttribute('aria-label', 'about this tool');
    helpBtn.setAttribute('aria-expanded', 'false');
    helpBtn.setAttribute('aria-haspopup', 'dialog');
    helpBtn.setAttribute('aria-controls', 'suiteHelp');
    helpBtn.innerHTML =
      '<svg viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round">' +
      '<circle cx="6" cy="6" r="4.25"/>' +
      '<path d="M6 5.2v3.1"/>' +
      '<circle cx="6" cy="3.65" r=".55" fill="currentColor" stroke="none"/>' +
      '</svg>';
    chrome.appendChild(helpBtn);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'suite-nav-btn';
    btn.id = 'suiteNavBtn';
    btn.setAttribute('aria-label', 'tools');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-controls', 'suiteNavPanel');
    btn.innerHTML =
      '<svg viewBox="0 0 12 12" aria-hidden="true" fill="currentColor">' +
      '<rect x="1" y="1" width="3" height="3" rx=".4"/>' +
      '<rect x="8" y="1" width="3" height="3" rx=".4"/>' +
      '<rect x="1" y="8" width="3" height="3" rx=".4"/>' +
      '<rect x="8" y="8" width="3" height="3" rx=".4"/>' +
      '</svg>';

    var panel = document.createElement('div');
    panel.className = 'suite-nav-panel';
    panel.id = 'suiteNavPanel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'tools');

    GROUPS.forEach(function (group) {
      var tools = TOOLS.filter(function (t) { return t.group === group.id; });
      if (!tools.length) return;
      var section = document.createElement('section');
      section.className = 'suite-group';
      section.setAttribute('aria-label', group.label);
      var label = document.createElement('span');
      label.className = 'suite-group-label';
      label.textContent = group.label;
      section.appendChild(label);
      var grid = document.createElement('ul');
      grid.className = 'suite-grid';
      tools.forEach(function (tool) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'suite-tile' + (tool.status === 'soon' ? ' is-soon' : '');
        a.href = toolHref(tool);
        if (tool.id === currentId) a.setAttribute('aria-current', 'page');
        if (tool.status === 'soon') {
          a.setAttribute('aria-label', tool.label + ' (soon)');
        }
        a.innerHTML = iconSvg(tool) +
          '<span class="suite-tile-label">' + tool.label + '</span>' +
          '<span class="suite-tile-blurb">' + tool.blurb + '</span>' +
          (tool.status === 'soon' ? '<span class="suite-tile-soon" aria-hidden="true">soon</span>' : '');
        li.appendChild(a);
        grid.appendChild(li);
      });
      section.appendChild(grid);
      panel.appendChild(section);
    });

    var mapLink = document.createElement('a');
    mapLink.className = 'suite-map-link';
    mapLink.href = toolsMapHref();
    mapLink.textContent = 'all tools';
    if (currentId === 'tools') mapLink.setAttribute('aria-current', 'page');
    panel.appendChild(mapLink);

    bar.appendChild(chrome);
    bar.appendChild(btn);
    inner.appendChild(bar);
    inner.appendChild(panel);
    nav.appendChild(inner);
    document.body.appendChild(nav);

    var backdrop = document.createElement('div');
    backdrop.className = 'suite-help-backdrop';
    backdrop.id = 'suiteHelpBackdrop';
    backdrop.setAttribute('hidden', '');
    backdrop.setAttribute('aria-hidden', 'true');

    var helpPanel = document.createElement('aside');
    helpPanel.className = 'suite-help';
    helpPanel.id = 'suiteHelp';
    helpPanel.setAttribute('role', 'dialog');
    helpPanel.setAttribute('aria-modal', 'true');
    helpPanel.setAttribute('aria-labelledby', 'suiteHelpTitle');
    helpPanel.setAttribute('tabindex', '-1');
    helpPanel.setAttribute('hidden', '');
    fillHelpPanel(helpPanel, currentId);

    document.body.appendChild(backdrop);
    document.body.appendChild(helpPanel);

    adoptSuiteChrome(nav);
    registerShellWorker();

    function tiles() {
      return Array.prototype.slice.call(panel.querySelectorAll('.suite-tile'));
    }

    function setOpen(open) {
      var was = nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        closeHelp();
        panel.removeAttribute('hidden');
        if (!was) {
          requestAnimationFrame(function () {
            var list = tiles();
            var cur = panel.querySelector('.suite-tile[aria-current="page"]');
            var target = cur || (list.length ? list[0] : null);
            if (target) {
              try { target.focus(); } catch (err) {}
            }
          });
        }
      } else {
        panel.setAttribute('hidden', '');
        if (was && document.activeElement && panel.contains(document.activeElement)) {
          try { btn.focus(); } catch (err) {}
        }
      }
    }

    panel.setAttribute('hidden', '');

    helpBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setHelpOpen(!isHelpOpen(), currentId);
    });

    helpPanel.addEventListener('click', function (e) {
      var closeEl = e.target && e.target.closest && e.target.closest('#suiteHelpClose');
      if (closeEl) {
        e.preventDefault();
        closeHelp();
        try { helpBtn.focus(); } catch (err) {}
      }
    });

    backdrop.addEventListener('click', function () {
      closeHelp();
      try { helpBtn.focus(); } catch (err) {}
    });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var next = !nav.classList.contains('is-open');
      setOpen(next);
      if (next) closeSettingsShell();
    });

    panel.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('is-open')) return;
      var list = tiles();
      if (!list.length) return;
      var i = list.indexOf(document.activeElement);
      var cols = 3;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        if (i < 0) i = 0;
        var next = i;
        if (e.key === 'ArrowRight') next = Math.min(list.length - 1, i + 1);
        else if (e.key === 'ArrowLeft') next = Math.max(0, i - 1);
        else if (e.key === 'ArrowDown') next = Math.min(list.length - 1, i + cols);
        else if (e.key === 'ArrowUp') next = Math.max(0, i - cols);
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = list.length - 1;
        list[next].focus();
      }
    });

    document.addEventListener('pointerdown', function (e) {
      if (!nav.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isHelpOpen()) {
        e.preventDefault();
        closeHelp();
        try { helpBtn.focus(); } catch (err) {}
        return;
      }
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        e.preventDefault();
        setOpen(false);
        btn.focus();
      }
    });
  }


  function registerShellWorker() {
    try {
      if (!('serviceWorker' in navigator)) return;
      if (!global.location || global.location.protocol === 'file:') return;
      var root = suiteRoot();
      var swUrl = (!root || root === '/') ? '/sw.js' : root + '/sw.js';
      navigator.serviceWorker.register(swUrl, { scope: (!root || root === '/') ? '/' : root + '/' }).catch(function () {});
    } catch (e) {}
  }

  function loadShared() {
    try {
      var raw = localStorage.getItem(SHARED_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveShared(partial) {
    var next = loadShared();
    var key;
    for (key in partial) {
      if (Object.prototype.hasOwnProperty.call(partial, key)) next[key] = partial[key];
    }
    try {
      localStorage.setItem(SHARED_KEY, JSON.stringify(next));
    } catch (e) {}
    return next;
  }

  function mergeSharedInto(settings, keys) {
    var shared = loadShared();
    var out = settings || {};
    (keys || LOOK_KEYS).forEach(function (key) {
      if (shared[key] != null) out[key] = shared[key];
    });
    return out;
  }

  function pushSharedFrom(settings, keys) {
    var partial = {};
    (keys || LOOK_KEYS).forEach(function (key) {
      if (settings && settings[key] != null) partial[key] = settings[key];
    });
    saveShared(partial);
  }

  function loadHints() {
    var shared = loadShared();
    return shared && shared.hints ? shared.hints : {};
  }

  function hintSeen(key) {
    return !!loadHints()[key];
  }

  function markHintSeen(key) {
    var hints = loadHints();
    hints[key] = Date.now();
    saveShared({ hints: hints });
  }

  global.IBMTools = {
    SHARED_KEY: SHARED_KEY,
    THEMES: THEMES,
    LOOK_KEYS: LOOK_KEYS,
    TOOLS: TOOLS,
    GROUPS: GROUPS,
    detectToolId: detectToolId,
    toolHref: toolHref,
    toolsMapHref: toolsMapHref,
    toolById: toolById,
    helpFor: helpFor,
    mountSuiteNav: mountSuiteNav,
    closeSuiteNav: closeSuiteNav,
    closeHelp: closeHelp,
    isHelpOpen: isHelpOpen,
    openHelp: openHelp,
    adoptSuiteChrome: adoptSuiteChrome,
    loadShared: loadShared,
    saveShared: saveShared,
    mergeSharedInto: mergeSharedInto,
    pushSharedFrom: pushSharedFrom,
    hintSeen: hintSeen,
    markHintSeen: markHintSeen,
    registerShellWorker: registerShellWorker
  };
})(typeof window !== 'undefined' ? window : globalThis);
