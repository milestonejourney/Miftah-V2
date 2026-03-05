// ============================================================
// MORPHOLOGY_1 — Surah Al-Fatiha (1)
// One const. No exports. No logic. No references to other globals.
// Keyed by ayah number (1-7). Each value is an array of word objects.
// Fields: arabic, trans, root, pos, form, irab, segments, note
// ============================================================

const MORPHOLOGY_1 = {
  1: [
      {
        arabic: "بِسْمِ",
        trans: "In (the) name",
        root: "س م و",
        pos: "Noun",
        form: "Ism — masdar-like noun in construct state (mudaf), prefixed with preposition bi (by/in/with)",
        irab: "Majrur by bi; mudaf to the following ism al-jalala; the prepositional phrase is the khabar of a deleted mubtada: 'I begin in the name of...'",
        segments: null,
        note: "The deletion of the verb 'abda'u (I begin) is a standard grammatical ellipsis. Beginning with bi + ism signals conscious dedication of the act to follow."
      },
      {
        arabic: "ٱللَّهِ",
        trans: "(of) Allah",
        root: "أ ل ه",
        pos: "Proper Noun",
        form: "Ism al-jalala — the supreme proper name of the Divine, not derived from al-ilah in the view of many grammarians but held to be a primordial name",
        irab: "Majrur — mudaf ilayhi of bismi",
        segments: null,
        note: "The name Allah is unique in Arabic in that it cannot be applied to anything or anyone other than the Divine. Its definite article cannot be removed."
      },
      {
        arabic: "ٱلرَّحْمَـٰنِ",
        trans: "the Most Gracious",
        root: "ر ح م",
        pos: "Adjective (Sifa)",
        form: "Fa'lan pattern — intensive active adjective denoting overwhelming, all-encompassing mercy; used exclusively for Allah",
        irab: "Majrur — na't (adjective/attribute) of Allah",
        segments: null,
        note: "Ar-Rahman carries broader scope than Ar-Rahim — it encompasses all creation without condition, like rain that falls on everyone. It is one of the Names exclusive to Allah."
      },
      {
        arabic: "ٱلرَّحِيمِ",
        trans: "the Most Merciful",
        root: "ر ح م",
        pos: "Adjective (Sifa)",
        form: "Fa'il pattern — active participial adjective denoting sustained, specific, relational mercy directed especially toward the believers",
        irab: "Majrur — na't (adjective/attribute) of Allah",
        segments: null,
        note: "Ar-Rahim is the mercy that is targeted and enduring. Unlike Ar-Rahman, it can be used for other than Allah — the Prophet ﷺ is described as ra'uf rahim in 9:128."
      }
    ],
  2: [
      {
        arabic: "ٱلْحَمْدُ",
        trans: "All praises and thanks",
        root: "ح م د",
        pos: "Noun",
        form: "Al-hamd — masdar (verbal noun) with definite article al, making it comprehensive: all praise of every type",
        irab: "Marfu' — mubtada (subject of a nominal sentence); al signals comprehensiveness",
        segments: null,
        note: "Hamd differs from shukr: hamd praises inherent qualities as well as received gifts; shukr is only for received favors. Allah taught His servants to return hamd to Him."
      },
      {
        arabic: "لِلَّهِ",
        trans: "(be) to Allah",
        root: "أ ل ه",
        pos: "Proper Noun",
        form: "Ism al-jalala prefixed with li (lam al-istihqaq — the lam of rightful ownership/deserving)",
        irab: "Majrur by li; the prepositional phrase is the khabar (predicate) of al-hamdu",
        segments: null,
        note: "The lam here is lam al-istihqaq — indicating that Allah is the rightful, deserving recipient of all hamd, not merely an incidental recipient."
      },
      {
        arabic: "رَبِّ",
        trans: "Lord of",
        root: "ر ب ب",
        pos: "Noun",
        form: "Rabb — active participial noun denoting the one who owns, sustains, nurtures, and has authority; construct state (mudaf)",
        irab: "Majrur — badal (substitute/appositive) of Allah, or na't; in construct state (mudaf) with al-'alamin",
        segments: null,
        note: "Rabb is one of the most comprehensive divine names — it encompasses creation, ownership, continuous nurturing, and sovereign authority all at once."
      },
      {
        arabic: "ٱلْعَـٰلَمِينَ",
        trans: "of the worlds",
        root: "ع ل م",
        pos: "Noun",
        form: "Jam' muzakkar salim (sound masculine plural) — the plural of 'alam, which itself has no singular in the sense of 'universe/world-category'",
        irab: "Majrur — mudaf ilayhi of rabb",
        segments: null,
        note: "'Alam shares its root with 'alamah (sign/marker) — every created world is a sign pointing to its Creator. Al-'alamin encompasses every category of existence: humans, jinn, angels, animals, and beyond."
      }
    ],
  3: [
      {
        arabic: "ٱلرَّحْمَـٰنِ",
        trans: "The Most Gracious",
        root: "ر ح م",
        pos: "Adjective (Sifa)",
        form: "Fa'lan pattern — intensive adjective of overwhelming universal mercy; exclusive to Allah",
        irab: "Majrur — na't (adjective) following rabb al-'alamin, or badal of Allah",
        segments: null,
        note: "The repetition of Ar-Rahman and Ar-Rahim from the Basmala is structurally deliberate — establishing mercy as both the entry and the sustaining atmosphere of the surah. After the majestic Rabb al-'alamin, mercy returns as a comfort."
      },
      {
        arabic: "ٱلرَّحِيمِ",
        trans: "the Most Merciful",
        root: "ر ح م",
        pos: "Adjective (Sifa)",
        form: "Fa'il pattern — sustained relational mercy, especially for the believers",
        irab: "Majrur — na't following ar-rahman",
        segments: null,
        note: "Al-Qurtubi noted that placing Ar-Rahman Ar-Rahim after Rabb al-'alamin creates a pairing of warning (accountability) and hope (mercy) — so the believer's heart holds both in balance."
      }
    ],
  4: [
      {
        arabic: "مَـٰلِكِ",
        trans: "Master / Sovereign",
        root: "م ل ك",
        pos: "Noun",
        form: "Fa'il pattern (active participle) — Malik: the one who possesses/owns absolutely. Variant reading Malik (king) is also mutawatir.",
        irab: "Majrur — na't or badal continuing the attributes of Allah; in construct state (mudaf) with yawm al-din",
        segments: null,
        note: "Two mass-transmitted recitations: Maliki (possessor/owner) and Maliki (king). Both are valid and complementary. On the Day of Judgment, Allah's ownership and kingship are absolute and uncontested — no human claim to authority remains."
      },
      {
        arabic: "يَوْمِ",
        trans: "Day",
        root: "ي و م",
        pos: "Noun",
        form: "Yawm — masculine singular noun for 'day'; construct state (mudaf)",
        irab: "Majrur — mudaf ilayhi of malik",
        segments: null,
        note: null
      },
      {
        arabic: "ٱلدِّينِ",
        trans: "of Recompense / Judgment",
        root: "د ي ن",
        pos: "Noun",
        form: "Masdar — Din carries the meanings of recompense, reckoning, religion, and submission; here specifically used as 'the accounting/repayment'",
        irab: "Majrur — mudaf ilayhi of yawm",
        segments: null,
        note: "Din shares a root meaning with the idea of a debt being settled. Yawm al-Din is the day when every account — every deed, every trust — is settled in full by the One who missed nothing."
      }
    ],
  5: [
      {
        arabic: "إِيَّاكَ",
        trans: "You Alone",
        root: null,
        pos: "Pronoun",
        form: "Iyyaka — detached object pronoun (damir munfasil) in the accusative, placed before the verb for emphasis and exclusivity (hasr/qasr)",
        irab: "Maf'ul bihi muqaddam (fronted object) — its advancement before the verb signals restriction: none other than You",
        segments: null,
        note: "The fronting of iyyaka before na'budu is one of the most celebrated grammatical constructions in Arabic rhetoric. Normal order would be na'budu iyyaka; the inversion emphatically declares: You — exclusively, none other — we worship."
      },
      {
        arabic: "نَعْبُدُ",
        trans: "we worship",
        root: "ع ب د",
        pos: "Verb",
        form: "Fi'l mudari' (present/imperfect tense) — first person plural; from 'abada, meaning to worship with utmost love, humility, and submission",
        irab: "Fi'l mudari' marfu'; fa'il (subject) is the implied 'nahnu' (we)",
        segments: null,
        note: "The shift to first-person plural (we) marks the speaker's entry into the community of worshippers — prayer is never a solo act; the servant speaks on behalf of the entire ummah."
      },
      {
        arabic: "وَإِيَّاكَ",
        trans: "and You Alone",
        root: null,
        pos: "Pronoun",
        form: "Wa + iyyaka — same detached object pronoun repeated with coordinating conjunction, reinforcing the exclusive focus on Allah for both worship and help",
        irab: "Ma'tuf (conjoined) on the first iyyaka; maf'ul bihi muqaddam for nasta'in",
        segments: null,
        note: "The repetition of iyyaka is significant — it could have been omitted, but its recurrence drives home that seeking help is also exclusively directed to Allah, parallel to and as exclusive as the worship."
      },
      {
        arabic: "نَسْتَعِينُ",
        trans: "we ask for help",
        root: "ع و ن",
        pos: "Verb",
        form: "Fi'l mudari' bab istif'al (Form X) — nasta'in: to seek help, to request assistance earnestly; Form X indicates seeking/requesting the base meaning",
        irab: "Fi'l mudari' marfu'; fa'il is implied 'nahnu'",
        segments: null,
        note: "Form X (istif'al) carries the nuance of actively seeking, requesting earnestly. Nasta'in is not passive dependence — it is a deliberate, active turning to Allah for help in every affair."
      }
    ],
  6: [
      {
        arabic: "ٱهْدِنَا",
        trans: "Guide us",
        root: "ه د ي",
        pos: "Verb",
        form: "Fi'l amr (imperative) from hadā — to guide, lead, direct to a path; first person plural object suffix -na (us) attached",
        irab: "Fi'l amr mabni 'ala hadhf harf al-'illa; fa'il is the implied 'anta' (You, Allah); na is maf'ul bihi",
        segments: null,
        note: "The imperative ihdina is a direct command turned into supplication — the servant makes a direct, urgent request of Allah. Not 'may we be guided' (passive) but 'guide us' (active command). This reflects the intimacy of the moment established in ayah 5."
      },
      {
        arabic: "ٱلصِّرَٰطَ",
        trans: "the path",
        root: "ص ر ط",
        pos: "Noun",
        form: "Al-sirat — masculine singular noun with definite article; denotes a broad, clear, well-established road (not a narrow trail)",
        irab: "Maf'ul bihi (object) of ihdina, or maf'ul bihi thani if ihdina takes two objects (guide us to the path)",
        segments: null,
        note: "Sirat carries the image of a wide, clear road — not a narrow path. The definiteness (al-sirat) indicates there is one specific path: Islam, the way of the prophets."
      },
      {
        arabic: "ٱلْمُسْتَقِيمَ",
        trans: "the straight",
        root: "ق و م",
        pos: "Adjective (Sifa)",
        form: "Ism maf'ul from Form X (istiqama) — the path that is caused to stand straight/upright; fully established, without deviation",
        irab: "Majrur — na't (adjective) of al-sirat",
        segments: null,
        note: "Mustaqim derives from qama (to stand) via Form X — the path that has been made perfectly upright, with no bend or deviation. It is not merely straight geometrically but morally and spiritually straight: the way Allah has established."
      }
    ],
  7: [
      {
        arabic: "صِرَٰطَ",
        trans: "The path of",
        root: "ص ر ط",
        pos: "Noun",
        form: "Sirat — same word as ayah 6; here without the definite article, in construct state (mudaf), specifying whose path is meant",
        irab: "Badal (substitute in apposition) of al-sirat al-mustaqim; mudaf to alladhina",
        segments: null,
        note: "The repetition of sirat without al- (now in construct state) functions as an appositive: the straight path = the path of those You blessed. The two are identified as one and the same."
      },
      {
        arabic: "ٱلَّذِينَ",
        trans: "those who",
        root: null,
        pos: "Relative Pronoun",
        form: "Alladhina — plural relative pronoun 'those who'; introduces the relative clause defining the recipients of divine favor",
        irab: "Mudaf ilayhi of sirat",
        segments: null,
        note: null
      },
      {
        arabic: "أَنْعَمْتَ",
        trans: "You have bestowed favor",
        root: "ن ع م",
        pos: "Verb",
        form: "Fi'l madi Form IV (an'ama) — to bestow blessings/favors abundantly; second person singular (anta/You); the direct attribution to Allah is theologically significant",
        irab: "Fi'l madi; fa'il is the ta' al-fa'il (you, Allah); the sentence is the sila (content) of alladhina",
        segments: null,
        note: "The active construction 'an'amta 'alayhim' (You bestowed favor upon them) directly attributes the blessing to Allah — a deliberate contrast with the passive construction used for the anger and misguidance below."
      },
      {
        arabic: "عَلَيْهِمْ",
        trans: "upon them",
        root: null,
        pos: "Preposition + Pronoun",
        form: "'Ala (upon) + him (them, masculine plural) — prepositional phrase completing the verb an'amta",
        irab: "Shibh jumlah (quasi-sentence/prepositional phrase) — mutalliq (connected) to an'amta",
        segments: null,
        note: null
      },
      {
        arabic: "غَيْرِ",
        trans: "not / other than",
        root: "غ ي ر",
        pos: "Noun",
        form: "Ghayr — noun meaning 'other than'; used here as an exceptive/negative modifier; construct state (mudaf)",
        irab: "Majrur — badal or hal (circumstantial description) of alladhina an'amta 'alayhim; or na't of sirat",
        segments: null,
        note: "Ghayr introduces the two negative descriptions — the path being requested is specifically distinguished from the paths of two deviated groups."
      },
      {
        arabic: "ٱلْمَغْضُوبِ",
        trans: "those who earned wrath",
        root: "غ ض ب",
        pos: "Noun (Ism Maf'ul)",
        form: "Ism maf'ul Form I — al-maghdhub: the one upon whom wrath has been brought; passive participle with definite article",
        irab: "Majrur — mudaf ilayhi of ghayr",
        segments: null,
        note: "The passive construction al-maghdhub 'alayhim (those upon whom wrath descended) omits the subject — the Divine courtesy of not explicitly saying 'those whom Allah made angry with.' Scholars note this grammatical restraint as characteristic of Qur'anic style."
      },
      {
        arabic: "عَلَيْهِمْ",
        trans: "upon them",
        root: null,
        pos: "Preposition + Pronoun",
        form: "'Ala + him — same construction as above; specifying upon whom the wrath descended",
        irab: "Shibh jumlah — sila/description completing al-maghdhub",
        segments: null,
        note: null
      },
      {
        arabic: "وَلَا",
        trans: "and not",
        root: null,
        pos: "Particle",
        form: "Wa (and) + la (not/nor) — coordinating conjunction with negation; the la here reinforces the exclusion of the second deviated group",
        irab: "Harf 'atf wa nafi (coordinating and negating particle)",
        segments: null,
        note: "The repetition of the negation (ghayr + wa la) is for emphasis — both paths of deviation are explicitly excluded, not just distinguished. The surah closes with clarity about what is NOT the straight path."
      },
      {
        arabic: "ٱلضَّآلِّينَ",
        trans: "those who go astray",
        root: "ض ل ل",
        pos: "Noun (Ism Fa'il)",
        form: "Ism fa'il (active participle) jam' muzakkar salim — al-dallin: those who are straying, wandering from the correct path; ongoing state implied by active participle",
        irab: "Majrur — ma'tuf (conjoined) on al-maghdhub; or mudaf ilayhi of a deleted ghayr",
        segments: null,
        note: "The use of the active participle al-dallin (those who are going astray) rather than a passive form suggests an ongoing condition — not those who went astray once, but those who are in a state of straying. This contrasts with the prophets, martyrs, and righteous who are on the established path."
      }
    ]
};
