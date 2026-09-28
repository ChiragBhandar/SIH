export type Language = "en" | "hi";

export interface TranslationDictionary {
  common: {
    language: string;
    english: string;
    hindi: string;
    changeLanguage: string;
    honeyChain: string;
    traceabilityPlatform: string;
    loading: string;
  };
  navbar: {
    product: string;
    workflow: string;
    platform: string;
    qualityTrust: string;
    verifyBottle: string;
    signIn: string;
    openWorkspace: string;
    publicVerification: string;
    signInPlatform: string;
  };
  hero: {
    eyebrow: string;
    titleStart: string;
    titleAccent: string;
    description: string;
    signInBtn: string;
    exploreWorkflowBtn: string;
    inputPlaceholder: string;
    verifyBtn: string;
    sampleLabel: string;
    wildForest: string;
    labTested: string;
    verifiedSeal: string;
    provenanceSubtext: string;
    pureIndianHoney: string;
    liveVerifiedSample: string;
  };
  stats: {
    hivesValue: string;
    hivesLabel: string;
    hivesDesc: string;
    collectivesValue: string;
    collectivesLabel: string;
    collectivesDesc: string;
    bottlesValue: string;
    bottlesLabel: string;
    bottlesDesc: string;
    labsValue: string;
    labsLabel: string;
    labsDesc: string;
  };
  showcase: {
    badge: string;
    heading: string;
    subheading: string;
    tabs: {
      dashboard: string;
      lab: string;
      custody: string;
      verify: string;
    };
    ledgerConnected: string;
    signInArrow: string;
    dashboard: {
      title: string;
      rbacActive: string;
      description: string;
      roles: {
        beekeeper: string;
        collector: string;
        lab: string;
        packager: string;
      };
      sealedVerified: string;
      coopLocation: string;
      signInToView: string;
      extractedNet: string;
      moistureIndex: string;
      moisturePassed: string;
      floralOrigin: string;
      wildMultifloral: string;
      ledgerState: string;
      cryptographicallySealed: string;
    };
    lab: {
      certificateTitle: string;
      gradeA: string;
      issuedBy: string;
      validSignature: string;
      nmrIndex: string;
      nmrDesc: string;
      c4Analysis: string;
      c4Passed: string;
      hmrFreshness: string;
      hmrStandard: string;
      pollenDensity: string;
      pollenSpec: string;
    };
    custody: {
      title: string;
      dualSigned: string;
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Accepted: string;
      step3Desc: string;
    };
    verifyPreview: {
      productTitle: string;
      verifiedAuthentic: string;
      bottleSerial: string;
      openFullPage: string;
      botanicalOrigin: string;
      originLocation: string;
      alpineFlora: string;
      harvestSeason: string;
      harvestMonth: string;
      autumnExtraction: string;
      labPurity: string;
      purityScore: string;
      nmrSpectroscopy: string;
      tamperStatus: string;
      activeSealed: string;
    };
  };
  values: {
    badge: string;
    heading: string;
    subheading: string;
    items: Array<{
      number: string;
      title: string;
      description: string;
      bulletPoints: string[];
    }>;
  };
  workflow: {
    badge: string;
    heading: string;
    subheading: string;
    stagePrefix: string;
    roleLabel: string;
    ledgerOutput: string;
    whatHappensHere: string;
    verifiedStageControls: string;
    onChainIdentifier: string;
    prevStage: string;
    nextStage: string;
    steps: Array<{
      id: string;
      number: string;
      title: string;
      shortTitle: string;
      actor: string;
      shortDesc: string;
      plainLanguage: string;
      details: string[];
      sampleData: {
        code: string;
        meta: string;
        status: string;
      };
    }>;
  };
  features: {
    badge: string;
    heading: string;
    subheading: string;
    bento1: {
      pill: string;
      personasPill: string;
      title: string;
      description: string;
      personas: Array<{
        title: string;
        desc: string;
      }>;
    };
    bento2: {
      title: string;
      description: string;
      lotText: string;
      lineageText: string;
    };
    bento3: {
      title: string;
      description: string;
      itemText: string;
      certifiedBadge: string;
    };
    bento4: {
      pill: string;
      title: string;
      description: string;
      stat1: string;
      stat2: string;
      stat3: string;
    };
  };
  visualFeatures: {
    section1: {
      badge: string;
      heading: string;
      description: string;
      bullets: string[];
      signInBtn: string;
      ledgerTitle: string;
      sectorTag: string;
      sealedVerified: string;
      extractedNet: string;
      moisture: string;
      floraOrigin: string;
      multifloral: string;
      boxLabel: string;
    };
    section2: {
      badge: string;
      heading: string;
      description: string;
      bullets: string[];
      signInBtn: string;
      cardTitle: string;
      gradeA: string;
      nmrMatch: string;
      passedSpectrum: string;
      c4Screening: string;
      standardLimit: string;
      hmfTitle: string;
      maxLimit: string;
      certRef: string;
      cryptographicallySigned: string;
    };
    section3: {
      badge: string;
      heading: string;
      description: string;
      bullets: string[];
      testLiveBtn: string;
      confirmedVerification: string;
      honeyName: string;
      jarLabel: string;
      originRegion: string;
      location: string;
      purityStandard: string;
      purityScore: string;
      openConsumerLink: string;
    };
  };
  finalCta: {
    heading: string;
    description: string;
    signInBtn: string;
    verifySampleBtn: string;
    badge1: string;
    badge2: string;
    badge3: string;
  };
  footer: {
    description: string;
    networkActive: string;
    modulesHeading: string;
    commercialHeading: string;
    governanceHeading: string;
    modules: {
      dashboard: string;
      apiaries: string;
      batches: string;
      custody: string;
      lab: string;
      processing: string;
    };
    commercial: {
      verify001: string;
      verify002: string;
      marketplace: string;
      serialization: string;
    };
    governance: {
      auditLog: string;
      orgScoping: string;
      rbac: string;
      certAuthority: string;
    };
    copyright: string;
    operatorSignIn: string;
    consumerPortal: string;
  };
  verifyPage: {
    consumerPortal: string;
    officialRegistry: string;
    backToHome: string;
    share: string;
    copied: string;
    queryingLedger: string;
    valid: {
      badge: string;
      confirmedRecord: string;
      bottleLabel: string;
      sizeLabel: string;
      certLabel: string;
      trustBadgesHeading: string;
      badges: {
        originRecorded: string;
        himalayanRegion: string;
        traceabilityComplete: string;
        unbrokenChain: string;
        qualityTested: string;
        passedPanel: string;
        certVerified: string;
        gradeA: string;
      };
      approvedInfoHeading: string;
      verifiedDataPill: string;
      botanicalOriginLabel: string;
      botanicalFloraSub: string;
      varietyLabel: string;
      varietySub: string;
      harvestSeasonLabel: string;
      qualityCertLabel: string;
      disclaimerSuffix: string;
      milestonesHeading: string;
      verifiedStepsCount: string;
    };
    unknown: {
      badge: string;
      title: string;
      descriptionStart: string;
      descriptionEnd: string;
      actionsHeading: string;
      action1: string;
      action2: string;
      action3: string;
    };
    unpublished: {
      badge: string;
      title: string;
      descriptionStart: string;
      descriptionEnd: string;
      note: string;
    };
    suspended: {
      badge: string;
      title: string;
      descriptionStart: string;
      descriptionEnd: string;
      reasonPrefix: string;
    };
    lookup: {
      heading: string;
      placeholder: string;
      submitBtn: string;
    };
    footer: {
      title: string;
      subtitle: string;
      returnLink: string;
      copyright: string;
    };
  };
  loginPage: {
    traceabilityPlatform: string;
    networkActive: string;
    backToHome: string;
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    forgotPassword: string;
    hidePassword: string;
    showPassword: string;
    rememberMe: string;
    signInBtn: string;
    signingIn: string;
    quickCredentials: string;
    activeSessionDetected: string;
    continueToSession: string;
    reauthPrompt: string;
    forgotPasswordNotice: string;
    errorDefault: string;
    errorUnexpected: string;
    trustHeading: string;
    trustDescription: string;
    footerCopyright: string;
  };
  selectOrgPage: {
    headerSubtitle: string;
    signOut: string;
    step1: string;
    step2: string;
    title: string;
    subtitle: string;
    selected: string;
    clickToSelect: string;
    registerPrompt: string;
    continueBtn: string;
    footerText: string;
    orgs: Record<
      string,
      {
        name: string;
        displayType: string;
        membershipInfo: string;
      }
    >;
  };
  selectRolePage: {
    headerSubtitle: string;
    changeOrg: string;
    step1: string;
    step2: string;
    activeOrgLabel: string;
    typeLabel: string;
    switchBtn: string;
    title: string;
    subtitle: string;
    infoTitle: string;
    infoBody: string;
    orgRoleBadge: string;
    capabilitiesLabel: string;
    backBtn: string;
    continueBtn: string;
    footerText: string;
    roles: Record<
      string,
      {
        name: string;
        description: string;
        capabilities: string[];
      }
    >;
  };
}
