# Medical Terminology Decoder

## A ten-session, listening-first curriculum for understanding medical dramas

**Status:** Canonical curriculum and implementation specification  
**Audience:** Adults with fluent everyday English and no assumed biology, anatomy, Latin, Greek, or health-care background  
**Primary outcome:** Hear an unfamiliar medical term, recognize its high-yield word parts, and infer a useful plain-English meaning from context  
**Course length:** Ten sessions of approximately 60 minutes, including a cumulative final examination  
**Core inventory:** 66 semantic word-part families: 11 prefix families, 18 suffix families, and 37 root/combining-form families  
**Delivery:** A very small static web application, usable without an account, with progress stored in `localStorage`; optional freeCodeCamp sign-in and sync must reuse facilities already present in the host repository  

> This course teaches language comprehension, not diagnosis or treatment. A word-part analysis produces a useful first approximation, not a clinical conclusion. Learners should never use this course to make medical decisions.

---

## 1. Product and curriculum thesis

Most introductory medical-terminology courses are designed as prerequisites for health-care programs. They teach hundreds of word parts while touring every body system and introducing substantial anatomy and physiology. That is appropriate for future clinicians, coders, and medical-office staff, but it is too broad for this use case.

This course has a narrower job:

> Give a non-clinician enough recurring Greek and Latin building blocks to follow the fast medical dialogue in hospital dramas.

It therefore follows four rules.

1. **Decode instead of memorize whole dictionaries.** Learners repeatedly split words into prefix + root + suffix, infer a literal meaning, and then convert that literal meaning into natural English.
2. **Prioritize spoken dramatic medicine.** Cardiovascular, neurologic, respiratory, trauma, infection, cancer, diagnostic, and surgical language receives more time than low-frequency specialties.
3. **Require productivity.** A core family normally needs at least ten useful medical terms. A small number of transparent, high-frequency families are admitted as documented exceptions when their ordinary vocabulary is narrower.
4. **Train the ear.** Every lesson includes contextual listening prompts. Spelling supports recognition but is not the primary goal.

The course does **not** promise that 20% of all medical roots literally account for 80% of every script. No published root-level Pareto table was located. “Load-bearing 20%” is used here as a design principle: retain the small, reusable set that unlocks the largest number of likely words.

---

## 2. Research basis

### 2.1 Existing beginner books and courses

| Resource | Intended learner and method | What this curriculum adopts | What this curriculum deliberately omits |
| --- | --- | --- | --- |
| [*Medical Terminology: A Short Course*, 10th ed., Davi-Ellen Chabner](https://www.us.elsevierhealth.com/medical-terminology-a-short-course-9780443280955.html) | A commercial short course that emphasizes frequently encountered prefixes, suffixes, and roots, with workbook practice and pronunciation | A compact working vocabulary, immediate word building, plain explanations, and frequent practice | Its broader health-professions coverage and print-workbook scale |
| [*Medical Terminology*, 2nd ed., Open RN / Chippewa Valley Technical College](https://www.ncbi.nlm.nih.gov/books/NBK607453/) | A 2024, CC BY 4.0 text aligned to technical-college medical terminology; explicitly teaches prefix, root, suffix, combining vowel, pronunciation, matching, and drag-and-drop | Its analysis sequence, combining-vowel rules, distinction between decomposable and memorized terms, and interactive exercise types | Full coverage of all body systems and clinician-oriented detail |
| [*Building a Medical Terminology Foundation 2e*](https://ecampusontario.pressbooks.pub/medicalterminology2/) | A 2024, CC BY 4.0 OER for health-office, nursing, and related learners; body-system chapters combine word parts, whole terms, abbreviations, and introductory anatomy | Its approachable “medical language” framing, word-part practice, listen-and-repeat work, and reusable interactive patterns | The anatomy-course structure and large H5P dependency surface |
| [*Building a Medical Terminology Foundation 2e — Student Companion Workbook*](https://ecampusontario.pressbooks.pub/medicalterminology2studentworkbook/) | A companion emphasizing repeated clicking, matching, drag-and-drop, listening, recall, and self-checking | Short cycles of recognition, construction, retrieval, and feedback | Printable worksheets and an external course shell |
| [*The Language of Medical Terminology*](https://pressbooks.openeducationalberta.ca/medicalterminology/) | An OER originally designed for medical-office assistants and hospital unit clerks; begins with structure, then covers abbreviations, systems, tests, and hospital scenarios | Its concise explanations of combining forms and contrastive suffixes such as `-ectomy`, `-tomy`, and `-stomy` | The workplace-administration content and comprehensive body-system tour |
| [*Medical Terminology Systems: A Body Systems Approach*](https://www.fadavis.com/product/medical-terminology-systems-body-approach-masters-9) and [*Medical Terminology Express*](https://www.fadavis.com/product/medical-terminology-med-term-express-gylys-masters-3) | Commercial body-system texts centered on word building, medical records, and progressive activities | Build-before-memorize and terms in context | Medical-record production, spelling mastery, and professional documentation |

Two conclusions recur across these sources:

- A learner can infer many medical terms by finding the suffix, root, prefix, and combining vowel. The Open RN text explicitly recommends defining the suffix first and then moving through the remaining parts.
- Some important language cannot be reliably decomposed: acronyms, eponyms, modern English terms, and lexical “rebels” must be learned as whole expressions. This justifies the post-exam bonus rather than forcing every TV-essential expression into a false Greek/Latin analysis.

### 2.2 Medical-drama evidence

The strongest located frequency evidence is Aravind Sreeram’s 2025 study, [“What patients are hearing: a large-scale corpus analysis of the most referenced medical conditions and pharmacologic drugs in popular medical television”](https://search.proquest.com/openview/5ffa5bc00f2ff39df360e6032b3f7e68/1.pdf?cbl=7056408&pq-origsite=gscholar). It analyzed subtitle files from 711 episodes of *ER* and *Grey’s Anatomy*.

| Finding reported by the study | Mentions | Curriculum consequence |
| --- | ---: | --- |
| HIV | 216 | Teach as a whole-form bonus item; it is not efficiently decoded from classical roots |
| Stroke | 213 | Give neurologic roots heavy weight, but teach *stroke* itself as a whole-form bonus item |
| Heart attack | 213 | Give `cardi/o`, vessel, blood, clot, and speed/pressure language early and repeated exposure |
| Pneumonia | 168 | Teach the lung family `pneumon/o` and its spoken variants early |
| Morphine | 303 | Include in the post-exam medication bonus |
| Atropine | 188 | Include in the post-exam medication bonus |
| Lidocaine | 165 | Include in the post-exam medication bonus |

The study reports that cardiovascular and nervous-system conditions were the most represented organ-system categories, and that analgesics comprised 34% of mentions among its top 40 drug terms. This supports the course order: heart/blood first, brain/nerves next, then breathing and other systems.

The selection was also spot-checked against publicly readable dialogue from historically and currently prominent hospital dramas:

- [*St. Elsewhere* transcripts](https://transcripts.foreverdreaming.org/viewforum.php?f=2866), beginning with the [pilot](https://transcripts.foreverdreaming.org/viewtopic.php?t=158087), which alone uses terms involving gallstones, blood pressure, liver disease, vessel hardening, inflammation, pathology, blood, clots, rhythm, brain, imaging, and biopsy.
- [*ER* transcripts](https://transcripts.foreverdreaming.org/viewforum.php?f=1035).
- [*House* transcripts](https://transcripts.foreverdreaming.org/viewforum.php?f=890), representing diagnosis-heavy dialogue.
- [*Grey’s Anatomy* transcripts](https://transcripts.foreverdreaming.org/viewforum.php?f=11), supplementing the 711-episode published analysis.
- [*The Pitt* transcripts](https://transcripts.foreverdreaming.org/viewforum.php?f=3888), used as a current emergency-department spot check.

This is a **curriculum selection corpus**, not a new publishable frequency corpus. Transcript availability, transcription conventions, era, and show genre differ. The application must not display copyrighted script passages. All dramatic dialogue in this curriculum is newly written instructional text.

Medical dramas are not clinical authorities. Research does, however, show that health-sciences students commonly watch them and that educators use them to discuss professional and ethical issues; see [Cambra-Badii et al. (2021)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8474903/) and the [AMA Journal of Ethics discussion of medical students and TV drama](https://journalofethics.ama-assn.org/article/imagining-doctors-medical-students-and-tv-medical-drama/2007-03). PBS’s retrospective on [how *St. Elsewhere* portrayed procedures and professional pressure](https://www.pbs.org/wnet/pioneers-of-television/video/how-st-elsewhere-got-it-right/) supports its use as the historical anchor rather than a daytime soap.

### 2.3 Admission rule for a core family

A word-part family enters the core when it meets all of the following:

1. It helps decode at least ten useful medical terms, **or** has a documented exception.
2. It is likely in hospital, emergency, diagnostic, or surgical dialogue.
3. Its meaning is stable enough to support a useful first guess.
4. It can be practiced with terms a non-clinician can understand after no more than one sentence of anatomy.

Variants with the same practical meaning are grouped together. For example, Greek `nephr/o` and Latin `ren/o` both signal the kidney. Grouping reflects what a listener must recognize; it is not a claim that the forms share one historical root.

**Documented exceptions:** `tachy-/brady-` and `-pnea` have fewer than ten genuinely common everyday terms, but their frequent appearances in urgent dialogue make them indispensable. The skull/meninges, pancreas/gallbladder, death/infection, and female-reproductive cards group two or more adjacent roots so that learners receive ten useful contexts without padding a list with extremely rare formations.

---

## 3. Course-wide learner contract

Display the following text before Session 1:

> **Welcome to Medical Terminology Decoder.**
>
> You do not need biology, Latin, or Greek. Medical words often look enormous because several small meaning-parts have been joined together. You will learn to hear those parts.
>
> Your goal is not to memorize every word on every card. Your goal is to recognize recurring pieces. If you hear *pericarditis* and can reason “around + heart + inflammation,” you have succeeded—even if your first definition sounds awkward.
>
> Use this three-step routine:
>
> 1. Catch the ending. It often tells you what kind of problem or procedure this is.
> 2. Find the body root.
> 3. Add the beginning, then turn the literal pieces into natural English.
>
> Medical words have exceptions. Treat your analysis as a strong clue, not a diagnosis.

### 3.1 Notation shown to learners

| Notation | Meaning | Example |
| --- | --- | --- |
| `cardi/o` | Root plus its usual combining vowel | `cardi/o/logy` |
| `hyper-` | Prefix placed before a root | `hyper/tension` |
| `-itis` | Suffix placed after a root | `arthr/itis` |
| `/o/` | A joining sound, usually without meaning of its own | `gastr/o/enter/itis` |
| CAPITALS in a sound cue | Stressed spoken syllable | `cardiology`: car-dee-**OL**-uh-jee |

### 3.2 The combining-vowel explanation

Display verbatim in Session 1:

> The letter **o** is often a connector. It makes word parts easier to say. It usually carries no medical meaning.
>
> Keep it between two roots: `gastr/o/enter/itis`.
>
> Usually drop it before a suffix beginning with a vowel: `hepat/itis`, not `hepatoitis`.
>
> Keep it before a suffix beginning with a consonant: `cardi/o/logy`.
>
> Real medical language contains rebels. Your job is recognition, not policing every spelling rule.

### 3.3 Mastery levels

| Level | Learner can… | App treatment |
| --- | --- | --- |
| Seen | Recognize the card after an explanation | Mark after card view |
| Familiar | Match the family to its meaning | Mark after two correct recognition attempts |
| Usable | Decode a taught word without seeing the card | Mark after two correct contextual attempts on different screens |
| Transfer | Decode a new compound built from known parts | Mark after one novel-word item plus later retrieval |

The final exam measures recognition and transfer. It does not require perfect spelling of every term.

---

## 4. Canonical word-part inventory

### 4.1 How to use these cards

Every card below is canonical content. The application should show:

- the family and meaning;
- the sound cue;
- the exact coach line;
- five **active** examples first;
- the remaining examples behind “See more words in this family.”

The ten-or-more examples are an eligibility and breadth check. Only the first five examples on a card are required recall targets. Later examples are recognition practice and demonstrate transfer.

Origin labels are memory aids and are not assessed: **G** = Greek, **L** = Latin, **G/L** = mixed Greek and Latin forms.

### 4.2 Prefix cards

| ID | Family → meaning and origin | Sound cue and exact coach line | Ten-or-more example terms |
| --- | --- | --- | --- |
| P01 | `a-`, `an-` → without, absent, not (G) | “uh / an.” **Coach:** “At the front of a medical word, *a* or *an* often removes something.” | **apnea**, **anoxia**, **anemia**, **anuria**, **anencephaly**; asystole, aseptic, avascular, arrhythmia, anorexia |
| P02 | `dys-` → bad, painful, difficult, abnormal (G) | “diss.” **Coach:** “Dys says a normal function has become difficult, painful, or abnormal.” | **dyspnea**, **dysuria**, **dysphagia**, **dysplasia**, **dysrhythmia**; dyskinesia, dyspepsia, dysentery, dysfunction, dysmenorrhea |
| P03 | `hyper-` / `hypo-` → above or below normal (G) | “HIGH-per / HIGH-poh.” **Coach:** “Hyper goes high; hypo goes low.” | **hypertension**, **hypotension**, **hyperglycemia**, **hypoglycemia**, **hyperkalemia**; hypokalemia, hypernatremia, hyponatremia, hyperthermia, hypothermia, hyperthyroidism, hypothyroidism |
| P04 | `tachy-` / `brady-` → fast or slow (G) | “TACK-ee / BRAY-dee.” **Coach:** “Tachy races; brady takes a break.” | **tachycardia**, **bradycardia**, **tachypnea**, **bradypnea**, **tachyarrhythmia**; bradyarrhythmia, tachysystole, bradykinesia, tachyphylaxis, bradysystole |
| P05 | `endo-`, `intra-`, `peri-`, `epi-` → within, inside, around, upon (G/L) | “EN-doh / IN-truh / PAIR-ee / EP-ee.” **Coach:** “These prefixes place the problem: inside, around, or on a structure.” | **endocarditis**, **endoscopy**, **endotracheal**, **intravenous**, **intracranial**; intramuscular, pericarditis, perinatal, epidural, epidermal, epigastric, endocrine |
| P06 | `inter-`, `trans-`, `sub-`, `supra-` → between, across, under, above (L) | “IN-ter / tranz / sub / SOO-pruh.” **Coach:** “Hear the map: between, across, under, above.” | **intercostal**, **intervertebral**, **transdermal**, **transfusion**, **subcutaneous**; interstitial, transurethral, subdural, sublingual, suprapubic, supraventricular, suprarenal |
| P07 | `pre-`, `ante-`, `post-` → before or after (L) | “pree / AN-tee / pohst.” **Coach:** “These prefixes place an event on a timeline.” | **prenatal**, **preoperative**, **antepartum**, **postoperative**, **postpartum**; premedication, prediabetes, antenatal, postictal, postmortem, posttraumatic |
| P08 | `hemi-`, `semi-`, `para-` → half; partial; beside or abnormal (G/L) | “HEM-ee / SEM-ee / PAIR-uh.” **Coach:** “Hemi and semi divide; para usually puts something beside a structure or outside the usual pattern.” | **hemiplegia**, **hemiparesis**, **hemicolectomy**, **paraplegia**, **parathyroid**; hemithorax, hemisphere, semiconscious, semipermeable, paraumbilical |
| P09 | `anti-` → against, counteracting (G) | “AN-tie.” **Coach:** “Anti tells you what a treatment acts against.” | **antibiotic**, **anticoagulant**, **antiemetic**, **antihypertensive**, **antipyretic**; antiplatelet, antipsychotic, anticonvulsant, anti-inflammatory, antitoxin |
| P10 | `mono-`, `bi-`, `poly-`, `multi-` → one, two, many (G/L) | “MON-oh / bye / POL-ee / MUL-tee.” **Coach:** “Number prefixes tell you how many cells, sides, symptoms, or organs are involved.” | **monocyte**, **monoplegia**, **bilateral**, **bicuspid**, **polyuria**; monocular, biventricular, polydipsia, polyarthritis, polycythemia, multifocal, multiorgan |
| P11 | `neo-`, `meta-` → new; change/beyond/spread (G) | “NEE-oh / MET-uh.” **Coach:** “Neo means new. Meta often means change or beyond; in cancer dialogue, metastasis means spread to another site.” | **neoplasm**, **neoplastic**, **neoplasia**, **neoadjuvant**, **neovascularization**; metastasis, metastatic, metabolism, metaplasia, metacarpal |

### 4.3 Condition and procedure suffix cards

| ID | Family → meaning and origin | Sound cue and exact coach line | Ten-or-more example terms |
| --- | --- | --- | --- |
| S01 | `-itis` → inflammation (G) | “EYE-tiss.” **Coach:** “When you hear *itis*, ask what is inflamed.” | **arthritis**, **bronchitis**, **dermatitis**, **encephalitis**, **gastritis**; hepatitis, meningitis, nephritis, pancreatitis, pericarditis |
| S02 | `-osis`, `-iasis` → abnormal condition or process (G) | “OH-sis / EYE-uh-sis.” **Coach:** “This ending labels a condition; the root tells you which one.” | **cyanosis**, **fibrosis**, **necrosis**, **psychosis**, **thrombosis**; scoliosis, stenosis, atherosclerosis, nephrolithiasis, cholelithiasis |
| S03 | `-emia` → condition in or of the blood (G) | “EE-mee-uh.” **Coach:** “Emia moves your attention to the blood.” | **anemia**, **bacteremia**, **hyperglycemia**, **hypoglycemia**, **leukemia**; septicemia, uremia, hyperkalemia, hyponatremia, hypoxemia |
| S04 | `-oma` → mass, swelling, or tumor (G) | “OH-muh.” **Coach:** “Oma signals a mass or tumor, but it does not by itself tell you whether the mass is cancer.” | **adenoma**, **carcinoma**, **glioma**, **hematoma**, **hepatoma**; lymphoma, melanoma, myeloma, neuroma, sarcoma |
| S05 | `-algia`, `-dynia` → pain (G) | “AL-jee-uh / DIN-ee-uh.” **Coach:** “Find the body root, then attach the idea of pain.” | **arthralgia**, **cephalalgia**, **gastralgia**, **mastalgia**, **myalgia**; neuralgia, otalgia, nephralgia, mastodynia, pleurodynia |
| S06 | `-pathy` → disease or disorder (G) | “PATH-ee.” **Coach:** “Pathy says something is wrong with the named structure; it usually does not tell you the exact cause.” | **arthropathy**, **cardiomyopathy**, **encephalopathy**, **gastropathy**, **hepatopathy**; myelopathy, nephropathy, neuropathy, retinopathy, vasculopathy |
| S07 | `-pnea` → breathing (G) | “NEE-uh.” **Coach:** “Pnea is breathing; the prefix tells you what the breathing is doing.” | **apnea**, **dyspnea**, **tachypnea**, **bradypnea**, **orthopnea**; hyperpnea, hypopnea, eupnea, platypnea, trepopnea |
| S08 | `-uria` → urine or urination condition (G) | “YOOR-ee-uh.” **Coach:** “Uria points to urine; the beginning tells you what is present or how much is produced.” | **hematuria**, **proteinuria**, **polyuria**, **oliguria**, **anuria**; dysuria, glycosuria, ketonuria, bacteriuria, nocturia |
| S09 | `-rrhea`, `-rrhage`, `-rrhagia` → flow/discharge or heavy bursting flow (G) | “REE-uh / rij / RAY-jee-uh.” **Coach:** “These endings describe flow. Rrhage and rrhagia imply heavy or uncontrolled flow.” | **diarrhea**, **rhinorrhea**, **otorrhea**, **amenorrhea**, **hemorrhage**; leukorrhea, galactorrhea, bronchorrhea, menorrhagia, metrorrhagia |
| S10 | `-penia`, `-cytosis`, `-megaly` → too few, increased cells, enlargement (G) | “PEE-nee-uh / sigh-TOH-sis / MEG-uh-lee.” **Coach:** “These endings change quantity or size.” | **leukopenia**, **thrombocytopenia**, **neutropenia**, **pancytopenia**, **leukocytosis**; thrombocytosis, erythrocytosis, cardiomegaly, hepatomegaly, splenomegaly |
| S11 | `-plegia`, `-paresis` → paralysis or weakness (G) | “PLEE-jee-uh / puh-REE-sis.” **Coach:** “Plegia is paralysis; paresis is weakness or partial paralysis.” | **hemiplegia**, **paraplegia**, **quadriplegia**, **monoplegia**, **ophthalmoplegia**; hemiparesis, paraparesis, quadriparesis, monoparesis, gastroparesis |
| S12 | `-ectomy` → surgical removal (G) | “ECK-tuh-mee.” **Coach:** “Ectomy takes something out.” | **appendectomy**, **cholecystectomy**, **colectomy**, **craniectomy**, **gastrectomy**; hysterectomy, mastectomy, nephrectomy, pneumonectomy, thyroidectomy |
| S13 | `-otomy`, `-stomy` → incision into; surgically created opening (G) | “OT-uh-mee / STOW-mee.” **Coach:** “Tomy cuts into; stomy makes an opening. Do not swap them.” | **craniotomy**, **laparotomy**, **thoracotomy**, **tracheotomy**, **fasciotomy**; colostomy, gastrostomy, ileostomy, tracheostomy, urostomy |
| S14 | `-scope`, `-scopy` → viewing instrument; visual examination (G) | “skohp / SKOH-pee.” **Coach:** “The scope is the tool; scopy is the act of looking.” | **bronchoscope**, **bronchoscopy**, **colonoscope**, **colonoscopy**, **cystoscope**; cystoscopy, endoscope, endoscopy, laparoscope, laparoscopy |
| S15 | `-gram`, `-graphy` → record/image; process of recording (G) | “gram / GRAF-ee.” **Coach:** “A gram is the result; graphy is the process.” | **angiogram**, **angiography**, **electrocardiogram**, **electrocardiography**, **electroencephalogram**; electroencephalography, mammogram, mammography, myelogram, myelography |
| S16 | `-centesis`, `-opsy` → puncture to withdraw fluid; viewing/examining tissue (G) | “sen-TEE-sis / OP-see.” **Coach:** “Centesis takes out fluid with a puncture; opsy examines what was seen or sampled.” | **amniocentesis**, **arthrocentesis**, **paracentesis**, **pericardiocentesis**, **thoracentesis**; biopsy, autopsy, endomyocardial biopsy, needle biopsy, excisional biopsy |
| S17 | `-lysis`, `-plasty`, `-stasis` → break apart; repair/reshape; stop or hold steady (G) | “LYE-sis / PLAS-tee / STAY-sis.” **Coach:** “Lysis breaks, plasty reshapes, stasis stops or steadies.” | **thrombolysis**, **hemolysis**, **dialysis**, **adhesiolysis**, **angioplasty**; arthroplasty, cranioplasty, rhinoplasty, hemostasis, homeostasis |
| S18 | `-logy`, `-logist` → specialty/study; specialist (G) | “OL-uh-jee / OL-uh-jist.” **Coach:** “Logy names the field; logist names the specialist.” | **cardiology**, **cardiologist**, **neurology**, **neurologist**, **oncology**; oncologist, pathology, pathologist, radiology, radiologist |

### 4.4 Root and combining-form cards

| ID | Family → meaning and origin | Sound cue and exact coach line | Ten-or-more example terms |
| --- | --- | --- | --- |
| R01 | `cardi/o` → heart (G) | “CAR-dee-oh.” **Coach:** “When you hear cardi, put the heart at the center of the word.” | **cardiac**, **cardiology**, **cardiologist**, **cardiomegaly**, **cardiomyopathy**; cardiovascular, cardiogenic, cardiopulmonary, electrocardiogram, echocardiogram, endocarditis, pericarditis, tachycardia, bradycardia |
| R02 | `angi/o`, `vascul/o`, `vas/o` → vessel (G/L) | “AN-jee-oh / VAS-kyoo-loh / VAY-zoh.” **Coach:** “All three point to tubes that carry blood or other fluid; in TV medicine they usually mean blood vessels.” | **angiogram**, **angiography**, **angioplasty**, **angiogenesis**, **vasculitis**; angiopathy, vascular, cardiovascular, vasodilation, vasoconstriction, vasopressor, vasospasm |
| R03 | `arteri/o`, `ather/o`; `ven/o`, `phleb/o` → artery/plaque; vein (G/L) | “ar-TEER-ee-oh / ATH-er-oh / VEE-noh / FLEB-oh.” **Coach:** “Arteries carry blood away; veins carry it back. Ather points to fatty plaque.” | **arterial**, **arteriole**, **arteritis**, **arteriography**, **arteriosclerosis**; atherosclerosis, venous, intravenous, venipuncture, phlebitis, thrombophlebitis, phlebectomy |
| R04 | `hem/o`, `hemat/o` → blood (G) | “HEE-moh / hee-MAT-oh.” **Coach:** “Hem and hemat mean blood—even when the spelling shifts.” | **hematology**, **hematoma**, **hematuria**, **hemolysis**, **hemorrhage**; hemoglobin, hematocrit, hematopoiesis, hematemesis, hemoptysis, hemostasis, hemothorax |
| R05 | `thromb/o` → clot (G) | “THROM-boh.” **Coach:** “Thromb means a clot or a cell involved in clotting.” | **thrombosis**, **thrombus**, **thrombocyte**, **thrombocytopenia**, **thrombocytosis**; thrombolysis, thrombolytic, thrombectomy, thrombophlebitis, thromboembolism |
| R06 | `neur/o` → nerve (G) | “NOOR-oh.” **Coach:** “Neur points to nerves and the nervous system.” | **neurology**, **neurologist**, **neurological**, **neuron**, **neuropathy**; neuralgia, neuromuscular, neurosurgery, neurotoxicity, neurogenic |
| R07 | `encephal/o`, `cerebr/o` → brain/cerebrum (G/L) | “en-SEFF-uh-loh / seh-REE-broh.” **Coach:** “Both point to the brain; encephal is Greek, cerebr is Latin.” | **encephalitis**, **encephalopathy**, **electroencephalogram**, **encephalocele**, **anencephaly**; encephalomyelitis, meningoencephalitis, cerebral, cerebrospinal, cerebrovascular, cerebritis, cerebrovascular accident |
| R08 | `crani/o`, `mening/o` → skull; membranes around brain/spinal cord (G) | “CRAY-nee-oh / meh-NIN-goh.” **Coach:** “Crani is the skull; mening is the protective wrapping beneath it.” | **cranial**, **craniotomy**, **craniectomy**, **cranioplasty**, **intracranial**; craniofacial, meningitis, meningioma, meningeal, meningoencephalitis, meningomyelocele |
| R09 | `myel/o` → spinal cord or bone marrow (G) | “MY-eh-loh.” **Coach:** “Myel has two homes: spinal cord and bone marrow. Context decides.” | **myelitis**, **myelopathy**, **myelogram**, **myelography**, **myeloma**; myelodysplasia, myelosuppression, myelofibrosis, myelomeningocele, poliomyelitis |
| R10 | `psych/o` → mind (G) | “SY-koh.” **Coach:** “Psych points to the mind, mental state, or mental-health treatment.” | **psychiatry**, **psychiatrist**, **psychiatric**, **psychology**, **psychologist**; psychosis, psychotic, psychosomatic, psychotherapy, psychotropic |
| R11 | `pulmon/o`, `pneumon/o`, `pneum/o` → lung; lung or air (G/L) | “PULL-mon-oh / new-MON-oh / NEW-moh.” **Coach:** “Pulmon means lung. Pneum can mean lung or air, so use the rest of the word.” | **pulmonary**, **pulmonology**, **pulmonologist**, **cardiopulmonary**, **pneumonia**; pneumonitis, pneumonectomy, pneumothorax, pneumoperitoneum, pneumoconiosis, bronchopneumonia |
| R12 | `bronch/o` → bronchial airway (G) | “BRONK-oh.” **Coach:** “Bronch points to the branching airways inside the lungs.” | **bronchial**, **bronchitis**, **bronchiolitis**, **bronchoscopy**, **bronchospasm**; bronchiectasis, bronchodilator, bronchogenic, bronchopneumonia, bronchorrhea |
| R13 | `thorac/o`, `pleur/o` → chest; lining around lungs (G) | “thor-ACK-oh / PLOOR-oh.” **Coach:** “Thorac is the chest; pleur is the slippery lining around the lungs.” | **thoracic**, **thoracotomy**, **thoracostomy**, **thoracentesis**, **hemothorax**; pneumothorax, pleural, pleuritis, pleurodesis, pleural effusion |
| R14 | `trache/o`, `laryng/o` → windpipe; voice box (G) | “TRAY-kee-oh / luh-RING-oh.” **Coach:** “Larynx sits above the trachea; both belong to the main airway.” | **tracheal**, **endotracheal**, **tracheitis**, **tracheotomy**, **tracheostomy**; tracheobronchial, laryngeal, laryngitis, laryngoscopy, laryngectomy |
| R15 | `gastr/o` → stomach (G) | “GAS-troh.” **Coach:** “Gastr means stomach, not the entire abdomen.” | **gastric**, **gastritis**, **gastroscopy**, **gastrectomy**, **gastrostomy**; gastroenteritis, gastroenterology, gastroparesis, gastralgia, nasogastric |
| R16 | `enter/o`, `col/o`, `colon/o` → intestine; colon (G) | “EN-ter-oh / KOH-loh.” **Coach:** “Enter usually means intestine; col or colon narrows you to the colon.” | **enteritis**, **enteropathy**, **enteric**, **enteroscopy**, **gastroenteritis**; enterocolitis, colitis, colonoscopy, colectomy, colorectal, colostomy, megacolon |
| R17 | `hepat/o` → liver (G) | “heh-PAT-oh.” **Coach:** “Hepat always brings the liver into the picture.” | **hepatic**, **hepatitis**, **hepatology**, **hepatologist**, **hepatomegaly**; hepatoma, hepatotoxic, hepatocellular, hepatorenal, hepatobiliary |
| R18 | `pancreat/o`, `cholecyst/o`, `chol/e` → pancreas; gallbladder/bile (G) | “PAN-kree-at-oh / koh-lee-SIST-oh / koh-lee.” **Coach:** “Pancreat is pancreas; chole points to bile and cholecyst to the gallbladder.” | **pancreatic**, **pancreatitis**, **pancreatectomy**, **pancreatography**, **pancreaticoduodenectomy**; cholecystitis, cholecystectomy, cholelithiasis, cholecystogram, cholecystostomy |
| R19 | `nephr/o`, `ren/o` → kidney (G/L) | “NEFF-roh / REE-noh.” **Coach:** “Nephr is Greek and ren is Latin; both mean kidney.” | **nephrology**, **nephrologist**, **nephritis**, **nephropathy**, **nephrectomy**; nephrolithiasis, nephrotoxicity, renal, renal failure, hepatorenal |
| R20 | `ur/o` → urine or urinary tract (G) | “YOOR-oh.” **Coach:** “Ur points broadly to urine and the urinary system.” | **urology**, **urologist**, **urinary**, **uremia**, **urosepsis**; uropathy, urography, urodynamics, urogenital, urothelial |
| R21 | `cyst/o` → bladder or fluid-filled sac (G) | “SIST-oh.” **Coach:** “Cyst can mean the urinary bladder or a sac; context tells you which.” | **cystitis**, **cystoscopy**, **cystoscope**, **cystectomy**, **cystostomy**; cystogram, cystography, cystocele, cystolithiasis, cystic |
| R22 | `glyc/o`, `glycem-` → sugar/glucose (G) | “GLY-koh / gly-SEEM.” **Coach:** “Glyc points to sugar; with emia, it becomes sugar in the blood.” | **glucose**, **glycemia**, **hyperglycemia**, **hypoglycemia**, **glycosuria**; glycogen, glycolysis, glycoprotein, glycated hemoglobin, glycemic |
| R23 | `aden/o`, `thyr/o`, `thyroid/o`, `endocrin/o` → gland; thyroid; hormone-secreting system (G) | “AD-en-oh / THY-royd-oh / EN-doh-krin-oh.” **Coach:** “Aden means gland; thyr and thyroid name one major gland; endocrine names the hormone system.” | **endocrine**, **endocrinology**, **endocrinologist**, **endocrinopathy**, **thyroiditis**; thyroidectomy, hyperthyroidism, hypothyroidism, adenoma, adenopathy, adenocarcinoma, thyroid |
| R24 | `oste/o` → bone (G) | “OSS-tee-oh.” **Coach:** “Oste means bone.” | **osteoarthritis**, **osteoporosis**, **osteomyelitis**, **osteotomy**, **osteopathy**; osteoblast, osteoclast, osteosarcoma, osteopenia, osteogenesis |
| R25 | `arthr/o` → joint (G) | “AR-throh.” **Coach:** “Arthr points to a joint.” | **arthritis**, **arthralgia**, **arthropathy**, **arthroscopy**, **arthroplasty**; arthrocentesis, arthrodesis, osteoarthritis, polyarthritis, hemarthrosis |
| R26 | `my/o`, `muscul/o` → muscle (G/L) | “MY-oh / MUS-kyoo-loh.” **Coach:** “My and muscul mean muscle; do not confuse my with myel.” | **myalgia**, **myopathy**, **myositis**, **myocardial**, **myometrium**; myoma, electromyography, polymyositis, muscular, musculoskeletal |
| R27 | `spondyl/o`, `vertebr/o` → vertebra/spine (G/L) | “SPON-dih-loh / VER-teh-broh.” **Coach:** “Both point to the spinal column’s bones.” | **spondylitis**, **spondylosis**, **spondylolisthesis**, **spondylopathy**, **spondylodiscitis**; vertebral, intervertebral, vertebroplasty, vertebrectomy, vertebrobasilar |
| R28 | `derm/o`, `dermat/o`, `cutane/o` → skin (G/L) | “DER-moh / der-MAT-oh / kyoo-TAY-nee-oh.” **Coach:** “Derm is Greek and cutane is Latin; both mean skin.” | **dermal**, **dermatitis**, **dermatology**, **dermatologist**, **dermatosis**; epidermal, hypodermic, cutaneous, subcutaneous, transdermal |
| R29 | `onc/o`, `carcin/o` → tumor/cancer (G) | “ON-koh / car-SIN-oh.” **Coach:** “Onc is the cancer specialty; carcin points more directly to cancer.” | **oncology**, **oncologist**, **oncologic**, **oncogene**, **oncogenesis**; carcinoma, carcinogen, carcinogenic, adenocarcinoma, carcinomatosis |
| R30 | `cyt/o`, `hist/o` → cell; tissue (G) | “SIGH-toh / HISS-toh.” **Coach:** “Cyt is a cell; hist is tissue made from cells.” | **cytology**, **cytoplasm**, **cytotoxic**, **cytopenia**, **leukocyte**; erythrocyte, histology, histopathology, histochemistry, histocompatibility |
| R31 | `path/o` → disease (G) | “PATH-oh.” **Coach:** “Path names disease itself or the study and development of disease.” | **pathology**, **pathologist**, **pathological**, **pathogen**, **pathogenic**; pathogenesis, pathophysiology, neuropathy, cardiomyopathy, nephropathy |
| R32 | `necr/o`; `seps/o`, `septic/o` → tissue death; infection/putrefaction (G) | “NEK-roh / SEP-soh / SEP-tik-oh.” **Coach:** “Necr means dead tissue. Seps and septic signal dangerous infection language.” | **necrosis**, **necrotic**, **necrotizing**, **osteonecrosis**, **avascular necrosis**; sepsis, septic, septicemia, aseptic, urosepsis |
| R33 | `leuk/o`, `lymph/o`, `immun/o` → white; lymph; immune defense (G/L) | “LOO-koh / LIM-foh / im-YOON-oh.” **Coach:** “These families cluster around white blood cells, lymph, and immune defense.” | **leukocyte**, **leukemia**, **leukocytosis**, **leukopenia**, **lymphoma**; lymphocyte, lymphadenopathy, lymphatic, lymphedema, immunology, immunodeficiency, immunosuppression, autoimmune |
| R34 | `bacteri/o`, `vir/o` → bacterium; virus (G/L) | “bak-TEER-ee-oh / VEER-oh.” **Coach:** “These roots tell you which kind of microbe is involved.” | **bacterium**, **bacterial**, **bacteremia**, **bacteriology**, **antibacterial**; bactericidal, bacteriuria, virus, viral, viremia, virology, antiviral |
| R35 | `gynec/o`, `uter/o`, `hyster/o` → female reproductive system; uterus (G/L) | “GUY-neh-koh / YOO-ter-oh / HISS-ter-oh.” **Coach:** “Gynec is the specialty; uter and hyster point to the uterus.” | **gynecology**, **gynecologist**, **gynecologic**, **uterine**, **intrauterine**; extrauterine, hysterectomy, hysteroscopy, hysterotomy, hysterosalpingography |
| R36 | `obstetr/o`, `nat/o`, `neonat/o` → pregnancy/birth; birth; newborn (G/L) | “ob-STET-roh / NAY-toh / nee-oh-NAY-toh.” **Coach:** “Obstetr is pregnancy and birth care; nat is birth; neonat is a newborn.” | **obstetrics**, **obstetric**, **obstetrician**, **prenatal**, **antenatal**; postnatal, perinatal, neonatal, neonatology, neonatologist |
| R37 | `mamm/o`, `mast/o` → breast (G/L) | “MAM-oh / MASS-toh.” **Coach:** “Mamm and mast both mean breast.” | **mammary**, **mammogram**, **mammography**, **mammoplasty**, **mammalgia**; mastectomy, mastitis, mastalgia, mastopexy, gynecomastia |

### 4.5 The load-bearing 20%

Thirteen of the 66 families constitute the priority tier—almost exactly 20%. This is **not** a claim that they produce precisely 80% of words in every script. They were chosen by combining cross-word productivity, the organ-system results of the 711-episode subtitle study, and spot checks of serious hospital-drama dialogue.

| Priority | Family | Why it bears unusual decoding load |
| ---: | --- | --- |
| 1 | S01 `-itis` | Converts many organ roots into inflammation terms heard across specialties |
| 2 | S03 `-emia` | Unlocks blood, glucose, oxygen, electrolyte, microbe, and cancer language |
| 3 | P03 `hyper-` / `hypo-` | Distinguishes high/low values, excess/deficiency, and over/under-function |
| 4 | R01 `cardi/o` | Heart language is central in emergency and hospital dialogue |
| 5 | R04 `hem/o`, `hemat/o` | Repeats in bleeding, blood tests, blood collections, and blood specialties |
| 6 | R06 `neur/o` | Nervous-system complaints and consults are heavily represented in drama |
| 7 | R11 `pulmon/o`, `pneumon/o`, `pneum/o` | Unlocks lung, air, pneumonia, and chest-emergency language |
| 8 | R02 `angi/o`, `vascul/o`, `vas/o` | Repeats across imaging, procedures, circulation, and blood-pressure support |
| 9 | P04 `tachy-` / `brady-` | Gives an immediate fast/slow clue in urgent vital-sign and rhythm dialogue |
| 10 | S02 `-osis`, `-iasis` | Labels a wide range of abnormal conditions and processes |
| 11 | S06 `-pathy` | Turns many structures into broad disease/disorder terms without overclaiming a cause |
| 12 | S04 `-oma` | Makes masses and tumors intelligible while teaching the benign/malignant caution |
| 13 | P02 `dys-` | Repeats whenever breathing, swallowing, urination, rhythm, movement, or function is difficult or abnormal |

Give these families the highest retrieval frequency. A learner who pauses early should retain this tier, but completing the remaining families is what makes the decoder useful across body systems and procedures.

---

## 5. Session map

| Session | Theme | New core cards | Recycled cards | Approximate time |
| ---: | --- | --- | --- | ---: |
| 1 | Learn the decoder | P01–P03; S01–S06 | None | 60 min |
| 2 | Heart, vessels, blood, and clots | R01–R05; P04–P06 | P03; S01–S06 | 60 min |
| 3 | Brain, nerves, and altered function | R06–R10; P08; S11 | P01, P05–P06; S01–S06 | 60 min |
| 4 | Breathing, lungs, chest, and airway | R11–R14; S07 | P01–P04; S01–S06, S11 | 60 min |
| 5 | Stomach, intestines, liver, pancreas, and gallbladder | R15–R18; S09 | P01–P06; S01–S06 | 60 min |
| 6 | Kidneys, urine, sugar, and glands | R19–R23; S08, S10 | P01–P03, P06; S01–S06 | 60 min |
| 7 | Bones, joints, muscles, spine, and skin | R24–R28 | P02, P05–P06; S01–S06, S10–S11 | 60 min |
| 8 | Cancer, cells, disease, infection, and immunity | R29–R34; P09, P11 | P01–P03; S01–S06, S10 | 60 min |
| 9 | Reproduction, birth, time, and number | R35–R37; P07, P10 | P05, P08; S01–S06, S10 | 60 min |
| 10 | Procedures, tests, specialists, synthesis, and final exam | S12–S18 | All previous cards | 60–70 min |

---

## 6. Session 1 — Learn the decoder

### 6.1 Outcomes

By the end of this session, the learner can:

- distinguish prefix, root, suffix, and combining vowel;
- use `a-/an-`, `dys-`, and `hyper-/hypo-` as meaning clues;
- recognize `-itis`, `-osis/-iasis`, `-emia`, `-oma`, `-algia/-dynia`, and `-pathy`;
- produce a useful literal translation before trying to name an exact condition.

### 6.2 Minute-by-minute sequence

| Time | Activity |
| --- | --- |
| 0:00–0:05 | Four-item ungraded cold open |
| 0:05–0:12 | Learner contract and word-part explanation |
| 0:12–0:25 | Canonical cards P01–P03 and S01–S06 |
| 0:25–0:35 | Label and match word parts |
| 0:35–0:45 | Build words from tiles |
| 0:45–0:54 | Listening round: catch the ending |
| 0:54–1:00 | Exit ticket and recap |

### 6.3 Cold open

Display:

> **Try these before you study. Guessing is the point.**
>
> Listen once. Choose the answer that seems most plausible. These questions do not affect your score.

The audio transcript remains hidden until the learner answers.

1. Audio: “The patient is hypotensive.”
   - A. The patient has low blood pressure.
   - B. The patient has high blood pressure.
   - C. The patient has a blood infection.
   - **Answer:** A.
2. Audio: “The scan shows an intracranial hematoma.”
   - A. A mass of blood inside the skull.
   - B. Inflammation below the skin.
   - C. A tumor around the heart.
   - **Answer:** A.
3. Audio: “Her lipase is elevated; this may be pancreatitis.”
   - A. Inflammation of the pancreas.
   - B. Removal of the pancreas.
   - C. Pain around the pancreas.
   - **Answer:** A.
4. Audio: “Pulmonology wants a bronchoscopy.”
   - A. A visual examination of an airway.
   - B. A recording of the heart.
   - C. Surgical removal of a lung.
   - **Answer:** A.

After item 4, display:

> You just encountered pieces from the whole course. By Session 10, every correct answer will be explainable rather than guessable.

### 6.4 Exact teaching text: four kinds of pieces

Display the course-wide learner contract and combining-vowel explanation from Sections 3 and 3.2, then display:

> Think of a medical word as a short instruction.
>
> - The **root** names the main subject: `cardi` means heart.
> - A **prefix** modifies the subject: `peri` means around.
> - A **suffix** tells you the kind of event: `itis` means inflammation.
> - A **combining vowel**, usually `o`, helps the pieces connect.
>
> `peri/card/itis` therefore gives you “inflammation around the heart.” Natural medical English calls that inflammation of the sac around the heart.
>
> Start with the suffix because it tells you whether you are hearing an inflammation, condition, blood finding, tumor, pain, disease, test, or procedure.

Show canonical cards P01–P03 and S01–S06 in that order. For each card, play its sound cue, show the exact coach line, and reveal the five active examples one at a time.

### 6.5 Label the pieces

Prompt:

> Select each piece, then label it **prefix**, **root**, **suffix**, or **combining vowel**.

1. `hypo / glyc / emia`
   - `hypo` = prefix, below normal
   - `glyc` = root, sugar
   - `emia` = suffix, blood condition
   - Literal: blood condition involving low sugar
   - Natural: low blood sugar
2. `neur / o / pathy`
   - `neur` = root, nerve
   - `o` = combining vowel
   - `pathy` = suffix, disease/disorder
   - Natural: nerve disorder
3. `hemat / oma`
   - `hemat` = root, blood
   - `oma` = suffix, mass/swelling
   - Natural: a localized collection or mass of blood
4. `peri / card / itis`
   - `peri` = prefix, around
   - `card` = root, heart
   - `itis` = suffix, inflammation
   - Natural: inflammation of the sac around the heart
5. `dys / ur / ia`
   - `dys` = prefix, painful/difficult/abnormal
   - `ur` = root, urine/urination
   - `ia` = condition ending; it is not a core target
   - Natural: painful or difficult urination

Feedback for a mislabeled `o`:

> The `o` usually helps pronunciation. Do not force it to carry a body meaning.

### 6.6 Match the ending to the clue

| Ending | Choice to match |
| --- | --- |
| `-itis` | inflammation |
| `-osis` | abnormal condition or process |
| `-emia` | blood condition |
| `-oma` | mass, swelling, or tumor |
| `-algia` | pain |
| `-pathy` | disease or disorder |

Then ask:

1. Which ending would make you ask “what is inflamed?” — **`-itis`**
2. Which ending moves your attention to blood? — **`-emia`**
3. Which ending can describe a mass that is not necessarily cancer? — **`-oma`**
4. Which ending tells you a structure hurts? — **`-algia`**
5. Which ending says “disorder” without naming the exact cause? — **`-pathy`**

### 6.7 Build from tiles

Tiles should be selectable by click/tap and optionally draggable. A screen reader and keyboard user must be able to place them with buttons.

1. Build “inflammation of the liver.”
   - Tiles: `hepat`, `itis`, `hyper`, `oma`
   - **Build:** `hepat/itis`
2. Build “nerve pain.”
   - Tiles: `neur`, `o`, `algia`, `emia`
   - **Build:** `neur/algia`
   - Note: the combining `o` drops before the vowel beginning `-algia`.
3. Build “abnormal condition involving a clot.”
   - Tiles: `thromb`, `osis`, `dys`, `pathy`
   - **Build:** `thromb/osis`
4. Build “blood condition involving high sugar.”
   - Tiles: `hyper`, `glyc`, `emia`, `itis`
   - **Build:** `hyper/glyc/emia`
5. Build “disease of the heart muscle.”
   - Tiles: `cardi`, `o`, `my`, `o`, `pathy`
   - **Build:** `cardi/o/my/o/pathy`

After item 5, display:

> Long words become manageable when several familiar parts repeat. You do not yet need to memorize `cardi/o` or `my/o`; you only need to see how the method scales.

### 6.8 Listening round: catch the ending

Instruction:

> Listen for the bold idea, not perfect spelling. Choose what kind of information the final word gives you.

1. Audio: “The biopsy confirmed a **carcinoma**.”
   - Correct category: **mass or tumor**
2. Audio: “He reports severe **myalgia**.”
   - Correct category: **pain**
3. Audio: “The team is treating **meningitis**.”
   - Correct category: **inflammation**
4. Audio: “Diabetes can cause **neuropathy**.”
   - Correct category: **disease or disorder**
5. Audio: “The laboratory found **bacteremia**.”
   - Correct category: **condition in the blood**
6. Audio: “Imaging suggests **fibrosis**.”
   - Correct category: **abnormal condition or process**

Use this feedback after every correct answer:

> Good. You caught the word’s job before knowing every detail.

### 6.9 Exit ticket

1. The most useful first target in a long medical word is often the… **suffix**.
2. `hyper-` means… **above normal or excessive**.
3. `hypo-` means… **below normal or deficient**.
4. `dys-` most often signals… **difficulty, pain, or abnormal function**.
5. `-itis` means… **inflammation**.
6. `-emia` points to… **blood**.
7. Decode `hypoxemia` from the known pieces: **a blood condition involving below-normal oxygen**.
8. Why can `hematoma` not be translated simply as “blood cancer”? **Because `-oma` can mean a mass or swelling; a hematoma is a collection of blood, not inherently cancer.**

Exit feedback:

> You now have a decoder. In the next session, you will attach it to the vocabulary medical dramas use most: heart, vessels, blood, and clots.

---

## 7. Session 2 — Heart, vessels, blood, and clots

### 7.1 Outcomes

The learner can:

- recognize R01–R05 and P04–P06;
- distinguish heart, vessel, artery, vein, blood, and clot roots;
- decode rate, location, pressure, bleeding, and clot language in urgent dialogue;
- avoid confusing a blood mass (`hematoma`) with a blood cancer or a clot (`thrombus`).

### 7.2 Minute-by-minute sequence

| Time | Activity |
| --- | --- |
| 0:00–0:06 | Retrieval from Session 1 |
| 0:06–0:11 | Six-line anatomy map |
| 0:11–0:28 | Cards R01–R05 and P04–P06 |
| 0:28–0:39 | Sort the cardiovascular families |
| 0:39–0:49 | Word assembly and contrast pairs |
| 0:49–0:56 | Listening: emergency handoff |
| 0:56–1:00 | Exit ticket |

### 7.3 Retrieval warm-up

1. Inflammation → **`-itis`**
2. Blood condition → **`-emia`**
3. Disease/disorder → **`-pathy`**
4. Above normal → **`hyper-`**
5. Below normal → **`hypo-`**
6. Decode `dys + pnea` provisionally: **difficult or abnormal breathing**

### 7.4 Exact anatomy map

Display:

> You need six facts—not a cardiology course.
>
> 1. The **heart** is a pump.
> 2. **Arteries** carry blood away from the heart.
> 3. **Veins** carry blood back toward the heart.
> 4. **Vessels** is the umbrella term for those tubes.
> 5. Blood can collect outside vessels as a **hematoma**.
> 6. Blood can solidify inside a vessel as a **thrombus**, or clot.

Show R01–R05, then P04–P06. On P05 and P06, teach only the active examples now; the location families will recur in later sessions.

### 7.5 Sort the family

Place each term into **heart**, **vessel**, **artery/vein**, **blood**, or **clot**.

| Term | Correct family | Decoding note |
| --- | --- | --- |
| cardiomegaly | heart | `cardi/o` + enlargement |
| vasculitis | vessel | vessel + inflammation |
| phlebitis | vein | vein + inflammation |
| hematology | blood | blood + specialty |
| thrombosis | clot | clot + abnormal condition |
| angioplasty | vessel | vessel + reshaping/repair |
| atherosclerosis | arterial plaque | plaque + hardening/condition |
| hemothorax | blood | blood in the chest |
| tachycardia | heart/rate | fast heart rate |
| thrombolysis | clot | breaking apart a clot |

If the learner places `hematoma` under clot, show:

> A hematoma is collected blood in tissue or a space. A thrombus is a formed clot, usually discussed inside a vessel. The words may occur in the same case, but the roots are not interchangeable.

### 7.6 Contrast pairs

Display each pair, play both terms, and ask what changed.

1. **tachycardia / bradycardia** — fast heart rate / slow heart rate
2. **hypertension / hypotension** — high blood pressure / low blood pressure
3. **endocarditis / pericarditis** — inflammation of the inner heart lining / inflammation around the heart
4. **arterial / venous** — relating to an artery / relating to a vein
5. **thrombocytopenia / thrombocytosis** — too few platelets / increased platelet count
6. **vasodilation / vasoconstriction** — vessel widening / vessel narrowing

Exact explanation after pair 5:

> `thromb/o` can point to a clot or to thrombocytes, the cells better known as platelets. `-penia` means too few; `-cytosis` means an increased cell count. You will formally learn both endings in Session 6.

### 7.7 Build the cardiovascular word

1. fast + heart condition → `tachy/card/ia` → **tachycardia**
2. around + heart + inflammation → `peri/card/itis` → **pericarditis**
3. blood + chest → `hem/o/thorax` → **hemothorax**
4. clot + vein + inflammation → `thromb/o/phleb/itis` → **thrombophlebitis**
5. vessel + record/image → `angi/o/gram` → **angiogram**
6. heart + muscle + disorder → `cardi/o/my/o/pathy` → **cardiomyopathy**
7. within + vein + pertaining to → `intra/ven/ous` → **intravenous**
8. heart + vessel + pertaining to → `cardi/o/vascul/ar` → **cardiovascular**

For item 8, display:

> The ending `-ar` merely means “relating to.” You do not need to memorize every “relating to” ending to catch the important roots.

### 7.8 Listening: emergency handoff

Display:

> The following handoff is fictional. Listen one line at a time. After each line, choose the best plain-English inference.

1. Audio: “She is tachycardic and hypotensive.”
   - **Answer:** Her heart rate is fast and her blood pressure is low.
2. Audio: “There is an expanding hematoma in the left thigh.”
   - **Answer:** Blood is collecting into a growing mass in the thigh.
3. Audio: “The angiogram shows an arterial obstruction.”
   - **Answer:** A vessel image shows a blockage in an artery.
4. Audio: “Cardiology is concerned about cardiogenic shock.”
   - **Answer:** The heart team thinks the shock may be caused by failure of the heart’s pumping action.
5. Audio: “Ultrasound suggests thrombophlebitis.”
   - **Answer:** A vein appears inflamed and associated with a clot.
6. Audio: “Prepare for pericardiocentesis.”
   - **Answer:** Prepare for a puncture procedure to remove fluid from around the heart. `-centesis` will be formally taught in Session 10.

### 7.9 Exit ticket

1. `cardi/o` → **heart**
2. `angi/o` and `vascul/o` → **vessel**
3. `hem/o` → **blood**
4. `thromb/o` → **clot or platelet/clotting cell**
5. `tachy-` → **fast**
6. `brady-` → **slow**
7. Decode `endocarditis`. → **inflammation of the inner lining of the heart**
8. Decode `intravenous`. → **within a vein**

Exit feedback:

> Heart and blood language will return in every remaining session. Repetition here is intentional: these are among the most productive and drama-heavy families in the course.

---

## 8. Session 3 — Brain, nerves, and altered function

### 8.1 Outcomes

The learner can:

- recognize R06–R10, P08, and S11;
- distinguish brain, nerve, skull, meninges, spinal cord, and mind terminology;
- use location prefixes with neurologic terms;
- distinguish paralysis from weakness and recognize the ambiguous meanings of `myel/o`.

### 8.2 Minute-by-minute sequence

| Time | Activity |
| --- | --- |
| 0:00–0:06 | Cardiovascular retrieval |
| 0:06–0:12 | Nervous-system map |
| 0:12–0:29 | Cards R06–R10, P08, S11 |
| 0:29–0:39 | Structure sorting and dual-meaning practice |
| 0:39–0:49 | Location and function word builder |
| 0:49–0:56 | Listening: neurologic consult |
| 0:56–1:00 | Exit ticket |

### 8.3 Retrieval warm-up

1. `cardi/o` + `-pathy` → **heart disease/disorder**
2. `peri-` + `cardi/o` + `-itis` → **inflammation around the heart**
3. `thromb/o` + `-osis` → **condition involving a clot**
4. `brady-` + `cardia` → **slow heart rate**
5. `hem/o` + `-rrhage` → **heavy or uncontrolled bleeding**

### 8.4 Exact nervous-system map

Display:

> You need six landmarks.
>
> - The **brain** processes and coordinates.
> - The **spinal cord** carries signals between brain and body.
> - **Nerves** branch from the brain and spinal cord.
> - The **meninges** are protective membranes around the brain and spinal cord.
> - The **cranium** is the skull around the brain.
> - **Psych** words concern the mind or mental state, not the physical brain alone.

Show R06–R10, P08, and S11.

When R09 appears, display this warning prominently:

> **Context fork:** `myel/o` can mean spinal cord or bone marrow.
>
> `myelitis` usually concerns the spinal cord. `Myeloma` concerns plasma cells in bone marrow. Do not decide until you hear the rest of the case.

### 8.5 Sort by structure

| Term | Best structure | Explanation |
| --- | --- | --- |
| neuropathy | nerve | nerve disorder |
| encephalitis | brain | brain inflammation |
| craniotomy | skull | incision into/opening of the skull |
| meningitis | meninges | inflammation of the protective membranes |
| myelopathy | spinal cord or marrow | context required; in neurologic dialogue, usually spinal cord disorder |
| psychosis | mind/mental state | abnormal mental condition |
| cerebral | cerebrum/brain | relating to the cerebrum |
| neuromuscular | nerve + muscle | relating to nerves and muscles together |

### 8.6 Paralysis or weakness?

1. `hemiplegia` → paralysis of one side
2. `hemiparesis` → weakness or partial paralysis of one side
3. `paraplegia` → paralysis of the lower body/two corresponding limbs in ordinary clinical use
4. `paraparesis` → weakness of the lower body/two corresponding limbs
5. `quadriplegia` → paralysis affecting all four limbs
6. `quadriparesis` → weakness affecting all four limbs

Display:

> TV dialogue may use these words quickly, but the distinction matters: `-plegia` is paralysis; `-paresis` is weakness or incomplete paralysis.

### 8.7 Build location and function

1. inside + skull + pertaining to → `intra/crani/al` → **intracranial**
2. brain + inflammation → `encephal/itis` → **encephalitis**
3. meninges + brain + inflammation → `mening/o/encephal/itis` → **meningoencephalitis**
4. nerve + pain → `neur/algia` → **neuralgia**
5. nerve + muscle + pertaining to → `neur/o/muscul/ar` → **neuromuscular**
6. half/one side + weakness → `hemi/paresis` → **hemiparesis**
7. skull + surgical repair → `crani/o/plasty` → **cranioplasty**
8. spinal cord + record → `myel/o/gram` → **myelogram**

### 8.8 Listening: neurologic consult

1. Audio: “The CT shows an intracranial hemorrhage.”
   - **Answer:** There is bleeding inside the skull.
2. Audio: “She has new left-sided hemiparesis.”
   - **Answer:** She has new weakness on the left side.
3. Audio: “Start precautions while we rule out meningitis.”
   - **Answer:** The team is considering inflammation/infection of the membranes around the brain and spinal cord.
4. Audio: “The encephalopathy may be metabolic.”
   - **Answer:** The patient has a brain-function disorder that may result from a body-chemistry problem; the suffix does not name the exact cause.
5. Audio: “Neurosurgery recommends a craniotomy.”
   - **Answer:** The nerve/brain surgery team recommends making a surgical opening in the skull.
6. Audio: “Oncology is evaluating the patient for myeloma.”
   - **Answer:** In this cancer context, `myel/o` points to bone marrow rather than the spinal cord.
7. Audio: “The symptoms may be psychogenic.”
   - **Answer:** The symptoms may arise from psychological processes. This does not mean the symptoms are imaginary.

### 8.9 Exit ticket

1. `neur/o` → **nerve**
2. `encephal/o` → **brain**
3. `crani/o` → **skull**
4. `mening/o` → **membranes around brain and spinal cord**
5. Two meanings of `myel/o` → **spinal cord or bone marrow**
6. `psych/o` → **mind/mental state**
7. `-plegia` versus `-paresis` → **paralysis versus weakness/partial paralysis**
8. Decode `meningoencephalitis`. → **inflammation of the meninges and brain**

Exit feedback:

> You can now separate several words TV dialogue often compresses into one breath: nerve, brain, skull, protective membranes, spinal cord, and mind.

---

## 9. Session 4 — Breathing, lungs, chest, and airway

### 9.1 Outcomes

The learner can:

- recognize R11–R14 and S07;
- distinguish lung, bronchial airway, chest/pleura, trachea, and larynx;
- decode `apnea`, `dyspnea`, `tachypnea`, `bradypnea`, and `hypopnea`;
- use context to decide whether `pneum/o` means lung or air.

### 9.2 Minute-by-minute sequence

| Time | Activity |
| --- | --- |
| 0:00–0:06 | Nervous-system retrieval |
| 0:06–0:11 | Airway map |
| 0:11–0:27 | Cards R11–R14 and S07 |
| 0:27–0:38 | Route-of-air sorting |
| 0:38–0:48 | Prefix + `-pnea` lab and word builder |
| 0:48–0:56 | Listening: respiratory emergency |
| 0:56–1:00 | Exit ticket |

### 9.3 Retrieval warm-up

1. `hemi-` + `-paresis` → **weakness on one side**
2. `mening/o` + `-itis` → **inflammation of the meninges**
3. `encephal/o` + `-pathy` → **brain-function disorder**
4. `intra-` + `crani/o` → **inside the skull**
5. `a-` + `-pnea` → Make a provisional guess: **without breathing**

### 9.4 Exact airway map

Display:

> Follow one breath.
>
> Air passes the **larynx**, or voice box; travels down the **trachea**, or windpipe; enters the branching **bronchi**; and reaches the **lungs**. The lungs sit inside the **thorax**, or chest, and are wrapped by a thin lining called the **pleura**.
>
> That single route explains most roots in this session.

Show R11–R14 and S07.

After R11, display:

> `pneum/o` is a context root. In *pneumonia*, it points to lung. In *pneumothorax*, it points to air in the chest. If your first guess is simply “lung or air problem,” keep listening.

### 9.5 Route-of-air sorting

Place each term at **larynx**, **trachea**, **bronchi**, **lung**, **pleura**, or **chest**.

| Term | Correct location | Literal clue |
| --- | --- | --- |
| laryngitis | larynx | voice-box inflammation |
| endotracheal | trachea | within the trachea |
| bronchospasm | bronchi | sudden tightening of bronchial airways |
| pneumonitis | lung | lung inflammation |
| pleuritis | pleura | pleural inflammation |
| hemothorax | chest | blood in the chest |
| pneumothorax | chest | air in the chest |
| bronchoscopy | bronchi | visual airway examination |

### 9.6 Prefix + breathing lab

| Word | Parts | Useful meaning |
| --- | --- | --- |
| apnea | `a-` + `-pnea` | absence or stopping of breathing |
| dyspnea | `dys-` + `-pnea` | difficult or uncomfortable breathing |
| tachypnea | `tachy-` + `-pnea` | abnormally fast breathing |
| bradypnea | `brady-` + `-pnea` | abnormally slow breathing |
| hypopnea | `hypo-` + `-pnea` | abnormally shallow or reduced breathing |
| hyperpnea | `hyper-` + `-pnea` | increased depth/rate of breathing |

Prompt:

> You hear only the first half of a word. Predict what should happen to breathing.

1. `tachy…` → **faster**
2. `brady…` → **slower**
3. `dys…` → **difficult or abnormal**
4. `a…` → **absent**
5. `hypo…` → **reduced**

### 9.7 Build the respiratory word

1. bronchial airway + inflammation → `bronch/itis` → **bronchitis**
2. lung + removal → `pneumon/ectomy` → **pneumonectomy**
3. trachea + created opening → `trache/o/stomy` → **tracheostomy**
4. chest + puncture to remove fluid → `thorac/o/centesis` → **thoracentesis**
5. lung + bronchial airway + condition → `bronch/o/pneumon/ia` → **bronchopneumonia**
6. pleura + inflammation → `pleur/itis` → **pleuritis**
7. within + trachea + pertaining to → `endo/trache/al` → **endotracheal**
8. air + chest → `pneum/o/thorax` → **pneumothorax**

For items 2–4, show:

> You are previewing procedure endings. For now, notice that the body root remains stable. Session 10 will make the procedure endings precise.

### 9.8 Listening: respiratory emergency

1. Audio: “He is tachypneic and becoming hypoxemic.”
   - **Answer:** He is breathing fast and has below-normal oxygen in his blood.
2. Audio: “Breath sounds are absent on the left; consider pneumothorax.”
   - **Answer:** The team is considering air in the left chest around a lung.
3. Audio: “The bronchodilator relieved the bronchospasm.”
   - **Answer:** A medicine that widens the bronchial airways relieved their tightening.
4. Audio: “Pulmonology recommends bronchoscopy.”
   - **Answer:** The lung specialty recommends visually examining the bronchial airways.
5. Audio: “There is a large pleural effusion; prepare for thoracentesis.”
   - **Answer:** Fluid has collected around the lung, and the team plans a chest puncture to remove/sample fluid.
6. Audio: “The patient remains apneic after the seizure.”
   - **Answer:** The patient is not breathing after the seizure.

### 9.9 Exit ticket

1. `pulmon/o` → **lung**
2. `bronch/o` → **bronchial airway**
3. `thorac/o` → **chest**
4. `pleur/o` → **lining around a lung**
5. `trache/o` → **trachea/windpipe**
6. `laryng/o` → **larynx/voice box**
7. `-pnea` → **breathing**
8. Why does `pneum/o` require context? → **It can point to lung or air.**

Exit feedback:

> A fast respiratory line is now a route you can follow: larynx, trachea, bronchi, lungs, pleura, chest—and a prefix describing the breathing.

---

## 10. Session 5 — Stomach, intestines, liver, pancreas, and gallbladder

### 10.1 Outcomes

The learner can:

- recognize R15–R18 and S09;
- distinguish stomach, intestine, colon, liver, pancreas, bile, and gallbladder language;
- decode common inflammation, imaging, removal, stone, and flow terms;
- keep organ location separate from symptom words such as pain, bleeding, and discharge.

### 10.2 Minute-by-minute sequence

| Time | Activity |
| --- | --- |
| 0:00–0:06 | Respiratory retrieval |
| 0:06–0:12 | Digestive map |
| 0:12–0:28 | Cards R15–R18 and S09 |
| 0:28–0:39 | Organ sorting |
| 0:39–0:49 | Long-word assembly |
| 0:49–0:56 | Listening: abdominal workup |
| 0:56–1:00 | Exit ticket |

### 10.3 Retrieval warm-up

1. `dys-` + `-pnea` → **difficult breathing**
2. `pneum/o` + `thorax` → **air in the chest**
3. `bronch/o` + `-itis` → **inflammation of a bronchial airway**
4. `thorac/o` + `-centesis` → **chest puncture to withdraw fluid**
5. `hem/o` + `thorax` → **blood in the chest**

### 10.4 Exact digestive map

Display:

> You need one route and three helper organs.
>
> Food reaches the **stomach**, moves through the **small intestine**, and then through the **colon**, or large intestine. The **liver** processes nutrients and makes bile. The **gallbladder** stores bile. The **pancreas** releases digestive substances and hormones, including insulin.
>
> These organs sit close together, so a dramatic abdominal case may mention several roots before the team knows which organ is responsible.

Show R15–R18 and S09.

When S09 appears, display:

> Double `r` endings look intimidating because Greek pieces changed spelling as they joined. Listen for the final sound: `-rrhea` is flow or discharge; `-rrhage/-rrhagia` is heavy, often uncontrolled flow.

### 10.5 Organ sorting

| Term | Organ/family | Plain meaning |
| --- | --- | --- |
| gastritis | stomach | stomach inflammation |
| gastroenteritis | stomach + intestine | inflammation involving stomach and intestine |
| colitis | colon | colon inflammation |
| hepatomegaly | liver | enlarged liver |
| pancreatitis | pancreas | pancreatic inflammation |
| cholecystitis | gallbladder | gallbladder inflammation |
| hepatotoxic | liver | harmful to the liver |
| gastroparesis | stomach | impaired/paralyzed stomach movement |
| colorectal | colon + rectum | relating to colon and rectum |
| hepatobiliary | liver + bile system | relating to liver and bile passages |

### 10.6 Guest pieces

Display:

> Two useful pieces appear in digestive shows but are not large enough for separate core cards:
>
> - `lith/o` means stone.
> - `-emesis` means vomiting.
>
> Therefore, `chole/lith/iasis` is a bile/gallstone condition, and `hemat/emesis` is vomiting blood.

### 10.7 Long-word assembly

1. stomach + intestine + inflammation → `gastr/o/enter/itis` → **gastroenteritis**
2. liver + enlargement → `hepat/o/megaly` → **hepatomegaly**
3. pancreas + inflammation → `pancreat/itis` → **pancreatitis**
4. gallbladder + removal → `cholecyst/ectomy` → **cholecystectomy**
5. colon + visual examination → `colon/o/scopy` → **colonoscopy**
6. stomach + created opening → `gastr/o/stomy` → **gastrostomy**
7. bile + stone + condition → `chole/lith/iasis` → **cholelithiasis**
8. blood + vomiting → `hemat/emesis` → **hematemesis**
9. heavy + uterine bleeding → `meno/rrhagia` → **menorrhagia**
10. nose + discharge → `rhin/o/rrhea` → **rhinorrhea**

After items 9 and 10, display:

> A suffix is reusable outside the body system where you first meet it. That transfer is the point of learning word parts.

### 10.8 Listening: abdominal workup

1. Audio: “The CT shows colitis but no perforation.”
   - **Answer:** The scan shows colon inflammation.
2. Audio: “Her liver enzymes are high, and hepatology is consulting.”
   - **Answer:** The liver specialty is evaluating the patient.
3. Audio: “Ultrasound confirms cholelithiasis with cholecystitis.”
   - **Answer:** Gallstones are present, along with inflammation of the gallbladder.
4. Audio: “The pain and lipase level suggest pancreatitis.”
   - **Answer:** The findings suggest pancreatic inflammation.
5. Audio: “He has hematemesis and may be hemorrhaging.”
   - **Answer:** He is vomiting blood and may be bleeding heavily.
6. Audio: “Gastroenterology plans an endoscopy.”
   - **Answer:** The stomach/intestine specialty plans a visual examination inside the digestive tract.

### 10.9 Exit ticket

1. `gastr/o` → **stomach**
2. `enter/o` → **intestine, usually small intestine**
3. `col/o` → **colon**
4. `hepat/o` → **liver**
5. `pancreat/o` → **pancreas**
6. `cholecyst/o` → **gallbladder**
7. `-rrhea` → **flow or discharge**
8. Decode `gastroenteritis`. → **inflammation of the stomach and intestine**

Exit feedback:

> You can now use the same condition endings with a new organ map. Notice how little completely new grammar was required.

---

## 11. Session 6 — Kidneys, urine, sugar, and glands

### 11.1 Outcomes

The learner can:

- recognize R19–R23, S08, and S10;
- recognize both Greek `nephr/o` and Latin `ren/o` for kidney;
- distinguish kidney, urinary system, bladder/sac, sugar, gland, thyroid, and endocrine language;
- decode quantity changes involving urine, cells, and organ size.

### 11.2 Minute-by-minute sequence

| Time | Activity |
| --- | --- |
| 0:00–0:06 | Digestive retrieval |
| 0:06–0:12 | Kidney/endocrine map |
| 0:12–0:29 | Cards R19–R23, S08, S10 |
| 0:29–0:39 | Fluid-location contrasts |
| 0:39–0:49 | Quantity and size lab |
| 0:49–0:56 | Listening: labs and urine output |
| 0:56–1:00 | Exit ticket |

### 11.3 Retrieval warm-up

1. `hepat/o` + `-megaly` → **enlarged liver**
2. `pancreat/o` + `-itis` → **pancreatic inflammation**
3. `cholecyst/o` + `-ectomy` → **removal of the gallbladder**
4. `hemat/o` + `-emesis` → **vomiting blood**
5. `enter/o` + `-pathy` → **intestinal disorder**

### 11.4 Exact kidney/endocrine map

Display:

> The **kidneys** filter the blood and produce urine. Urine travels through the urinary tract and is stored in the **bladder**. Greek-rooted words often use `nephr/o`; Latin-rooted words often use `ren/o`.
>
> The **endocrine system** is a network of glands that release hormones. The **thyroid** is one of those glands. Sugar terms often use `glyc/o`; blood-sugar terms combine it with `-emia`.
>
> You do not need the hormone pathways. You need to hear which fluid, organ, amount, or size is changing.

Show R19–R23, S08, and S10.

### 11.5 Where is the finding?

| Term | Finding | Location |
| --- | --- | --- |
| hematuria | blood | urine |
| glycosuria | sugar | urine |
| bacteriuria | bacteria | urine |
| uremia | urea/waste condition | blood |
| hypoglycemia | low sugar | blood |
| bacteremia | bacteria | blood |
| cystitis | inflammation | bladder |
| nephritis | inflammation | kidney |

Display after the table:

> `hematuria` and `uremia` sound related but point in opposite directions. `hematuria` is blood in urine. `Uremia` is a waste-product condition in the blood when kidney function is severely impaired.

### 11.6 Quantity and size lab

1. `polyuria` → many/much + urine → **excessive urination or urine volume**
2. `oliguria` → little + urine → **low urine output**
3. `anuria` → without + urine → **absence or near-absence of urine output**
4. `leukopenia` → white cells + too few → **low white-blood-cell count**
5. `leukocytosis` → white cells + increased cell condition → **high white-blood-cell count**
6. `thrombocytopenia` → platelets + too few → **low platelet count**
7. `cardiomegaly` → heart + enlargement → **enlarged heart**
8. `hepatomegaly` → liver + enlargement → **enlarged liver**
9. `splenomegaly` → spleen + enlargement → **enlarged spleen**; `splen/o` is a guest root.
10. `thyromegaly` → thyroid + enlargement → **enlarged thyroid**.

### 11.7 Build and contrast

1. kidney + disorder → `nephr/o/pathy` → **nephropathy**
2. kidney + removal → `nephr/ectomy` → **nephrectomy**
3. relating to kidney → `ren/al` → **renal**
4. bladder + visual examination → `cyst/o/scopy` → **cystoscopy**
5. high + sugar + blood condition → `hyper/glyc/emia` → **hyperglycemia**
6. low + thyroid + condition → `hypo/thyroid/ism` → **hypothyroidism**
7. gland + tumor → `aden/oma` → **adenoma**
8. hormone system + specialty → `endocrin/o/logy` → **endocrinology**

### 11.8 Listening: labs and urine output

1. Audio: “Urine output has fallen from oliguria to anuria.”
   - **Answer:** Low urine output has progressed to almost no urine output.
2. Audio: “Urinalysis shows hematuria and proteinuria.”
   - **Answer:** The urine contains blood and protein.
3. Audio: “Nephrology is evaluating acute renal failure.”
   - **Answer:** The kidney specialty is evaluating sudden kidney failure.
4. Audio: “She is confused and profoundly hypoglycemic.”
   - **Answer:** Her blood sugar is dangerously low; “profoundly” supplies the severity.
5. Audio: “The white count shows leukocytosis, not leukopenia.”
   - **Answer:** The white-cell count is increased, not decreased.
6. Audio: “The scan shows thyromegaly, and the labs suggest hyperthyroidism.”
   - **Answer:** The thyroid is enlarged and appears overactive.
7. Audio: “Cystoscopy found a mass in the bladder.”
   - **Answer:** Visual examination of the bladder found a mass.

### 11.9 Exit ticket

1. `nephr/o` and `ren/o` → **kidney**
2. `ur/o` → **urine/urinary tract**
3. `cyst/o` → **bladder or a sac**
4. `glyc/o` → **sugar**
5. `aden/o` → **gland**
6. `-uria` → **urine or urination condition**
7. `-penia` → **too few/deficiency**
8. `-megaly` → **enlargement**

Exit feedback:

> You can now hear where a laboratory finding lives—blood or urine—and whether the dialogue describes too much, too little, or enlargement.

---

## 12. Session 7 — Bones, joints, muscles, spine, and skin

### 12.1 Outcomes

The learner can:

- recognize R24–R28;
- distinguish bone, joint, muscle, spinal-bone, and skin roots;
- combine familiar condition and procedure suffixes with musculoskeletal roots;
- distinguish `my/o` (muscle) from `myel/o` (spinal cord or marrow).

### 12.2 Minute-by-minute sequence

| Time | Activity |
| --- | --- |
| 0:00–0:06 | Kidney/endocrine retrieval |
| 0:06–0:11 | Structure map |
| 0:11–0:27 | Cards R24–R28 |
| 0:27–0:38 | Bone, joint, muscle, spine, or skin? |
| 0:38–0:48 | Build and contrast |
| 0:48–0:56 | Listening: trauma and consults |
| 0:56–1:00 | Exit ticket |

### 12.3 Retrieval warm-up

1. `nephr/o` + `-itis` → **kidney inflammation**
2. `glyc/o` + `-uria` → **sugar in urine**
3. `hyper-` + `thyroid` + `-ism` → **overactive thyroid condition**
4. `leuk/o` + `-penia` → **too few white blood cells**
5. `cardi/o` + `-megaly` → **enlarged heart**

### 12.4 Exact structure map

Display:

> **Bones** provide rigid structure. **Joints** are places where bones meet. **Muscles** pull on structures to create movement. The **vertebrae** are the bones of the spinal column. **Skin** covers and protects the body.
>
> Keep two similar sounds separate:
>
> - `my/o` means muscle.
> - `myel/o` means spinal cord or bone marrow.
>
> One extra syllable can move the meaning to a different system.

Show R24–R28.

### 12.5 Sort the structure

| Term | Correct structure | Meaning |
| --- | --- | --- |
| osteoporosis | bone | condition of porous/less dense bone |
| arthritis | joint | joint inflammation |
| myopathy | muscle | muscle disorder |
| spondylosis | spine/vertebrae | degenerative/abnormal spinal condition |
| dermatitis | skin | skin inflammation |
| osteomyelitis | bone + marrow | infection/inflammation of bone and marrow |
| arthroscopy | joint | visual examination of a joint |
| vertebroplasty | vertebra | repair/stabilization procedure involving a vertebra |
| subcutaneous | skin | beneath the skin |
| neuromuscular | nerve + muscle | involving nerves and muscles |

After `osteomyelitis`, display:

> Here `myel/o` points to bone marrow because it is paired with `oste/o`. Context resolves the double meaning.

### 12.6 Build and contrast

1. bone + joint + inflammation → `oste/o/arthr/itis` → **osteoarthritis**
2. joint + pain → `arthr/algia` → **arthralgia**
3. muscle + inflammation → `myos/itis` → **myositis**
4. several + muscle + inflammation → `poly/myos/itis` → **polymyositis**
5. vertebra + repair → `vertebr/o/plasty` → **vertebroplasty**
6. between + vertebrae → `inter/vertebr/al` → **intervertebral**
7. beneath + skin + relating to → `sub/cutane/ous` → **subcutaneous**
8. across + skin + relating to → `trans/derm/al` → **transdermal**
9. skin + condition → `dermat/osis` → **dermatosis**
10. bone + cancerous tumor → `oste/o/sarcoma` → **osteosarcoma**

Contrast:

- `myalgia` = muscle pain
- `myelopathy` = spinal-cord or bone-marrow disorder
- `osteopathy` = bone disorder
- `arthropathy` = joint disorder

### 12.7 Guest trauma words

Display:

> Trauma dialogue relies on several common whole words rather than reusable classical families: **fracture**, **sprain**, **strain**, **dislocation**, **laceration**, and **contusion**. They will return in the bonus. For now, use roots to understand the anatomy around them: *vertebral fracture*, *muscular strain*, *cutaneous laceration*.

### 12.8 Listening: trauma and consults

1. Audio: “CT shows a cervical vertebral fracture.”
   - **Answer:** A spinal bone in the neck is fractured. `cervical` requires context because it can also relate to the cervix.
2. Audio: “Orthopedics suspects septic arthritis.”
   - **Answer:** The bone/joint specialty suspects an infected joint inflammation.
3. Audio: “She has proximal muscle weakness and possible myositis.”
   - **Answer:** Muscles near the body’s center are weak, possibly from muscle inflammation.
4. Audio: “MRI suggests spondylodiscitis.”
   - **Answer:** The scan suggests inflammation/infection involving vertebral structures and a spinal disc.
5. Audio: “Give the medication by subcutaneous injection.”
   - **Answer:** Deliver it into tissue beneath the skin.
6. Audio: “Dermatology biopsied the necrotic lesion.”
   - **Answer:** The skin specialty sampled a lesion containing dead tissue.

### 12.9 Exit ticket

1. `oste/o` → **bone**
2. `arthr/o` → **joint**
3. `my/o` → **muscle**
4. `spondyl/o`, `vertebr/o` → **vertebra/spine**
5. `derm/o`, `cutane/o` → **skin**
6. `my/o` versus `myel/o` → **muscle versus spinal cord/bone marrow**
7. Decode `polyarthritis`. → **inflammation of many joints**
8. Decode `transdermal`. → **across/through the skin**

Exit feedback:

> You can now attach injury and disease words to the correct physical structure without learning a full anatomy atlas.

---

## 13. Session 8 — Cancer, cells, disease, infection, and immunity

### 13.1 Outcomes

The learner can:

- recognize R29–R34, P09, and P11;
- distinguish tumor/cancer, cell/tissue, disease, tissue death, infection, immune, bacteria, and virus language;
- infer what common `anti-` drug classes act against;
- understand why `-oma` is not by itself proof of cancer and why *metastatic* means spread.

### 13.2 Minute-by-minute sequence

| Time | Activity |
| --- | --- |
| 0:00–0:06 | Musculoskeletal retrieval |
| 0:06–0:12 | Cell-to-disease map |
| 0:12–0:30 | Cards R29–R34, P09, P11 |
| 0:30–0:40 | Tumor, infection, or immune? |
| 0:40–0:50 | Drug-class and pathology builder |
| 0:50–0:57 | Listening: oncology and sepsis |
| 0:57–1:00 | Exit ticket |

### 13.3 Retrieval warm-up

1. `oste/o` + `sarcoma` → **bone cancer/tumor**
2. `dermat/o` + `-itis` → **skin inflammation**
3. `arthr/o` + `-centesis` → **joint puncture to withdraw fluid**
4. `my/o` + `-pathy` → **muscle disorder**
5. `necr/o` provisional meaning from Session 7 → **death/dead tissue**

### 13.4 Exact cell-to-disease map

Display:

> **Cells** combine to form **tissues**. Abnormal new growth is a **neoplasm**. A tumor can be benign or malignant; **cancer** is malignant disease. Cancer that has spread to another site is **metastatic**.
>
> **Pathology** studies disease and examines cells and tissues. **Necrosis** means tissue death. **Sepsis** is a dangerous whole-body response to infection; do not reduce it to the casual phrase “blood infection.” The immune system and white blood cells help defend against microbes such as bacteria and viruses.

Show R29–R34, P09, and P11.

After S04 is recalled, display:

> `-oma` means mass, swelling, or tumor. *Hematoma* is collected blood. *Adenoma* is usually a benign glandular tumor. *Carcinoma* is malignant. The rest of the word and the case determine which.

### 13.5 Sort the process

Place each term into **tumor/cancer**, **cell/tissue**, **infection/microbe**, **immune**, or **tissue death**.

| Term | Correct group | Meaning clue |
| --- | --- | --- |
| carcinoma | tumor/cancer | malignant epithelial cancer term |
| neoplasm | tumor/cancer | new growth |
| cytology | cell/tissue | study/examination of cells |
| histopathology | cell/tissue | diseased tissue examination |
| bacteremia | infection/microbe | bacteria detected in blood |
| viremia | infection/microbe | virus present in blood |
| immunosuppression | immune | reduced immune activity |
| leukopenia | immune/cells | too few white cells |
| necrosis | tissue death | dead tissue condition |
| osteonecrosis | tissue death | bone tissue death |

### 13.6 Build the pathology language

1. cancer specialty → `onc/o/logy` → **oncology**
2. cancer specialist → `onc/o/logist` → **oncologist**
3. gland + cancer → `aden/o/carcin/oma` → **adenocarcinoma**
4. cell + toxic → `cyt/o/toxic` → **cytotoxic**
5. tissue + disease study → `hist/o/path/o/logy` → **histopathology**
6. new + growth → `neo/plasm` → **neoplasm**
7. cancer spread condition → `meta/stasis` → **metastasis**
8. white cell + too few → `leuk/o/penia` → **leukopenia**
9. bacteria + blood condition → `bacter/emia` → **bacteremia**
10. without + infection/contamination → `a/septic` → **aseptic**

### 13.7 What does the drug act against?

| Drug class | Best inference |
| --- | --- |
| antibiotic | acts against bacteria; it does not imply effectiveness against viruses |
| antiviral | acts against viruses |
| anticoagulant | reduces/inhibits clotting |
| antiemetic | acts against nausea/vomiting |
| antihypertensive | lowers/treats high blood pressure |
| antipyretic | reduces fever; `pyr/o` is a guest root meaning fever/heat |
| antiplatelet | reduces platelet clumping |
| antipsychotic | treats psychotic symptoms |
| anticonvulsant | acts against seizures/convulsions |
| anti-inflammatory | reduces inflammation |

Display:

> The word class tells you the intended target, not whether a particular medicine is appropriate for a particular person.

### 13.8 Listening: oncology and sepsis

1. Audio: “The biopsy shows metastatic adenocarcinoma.”
   - **Answer:** The sampled tissue shows a gland-forming cancer that has spread from another site or is described as having spread.
2. Audio: “She is neutropenic and bacteremic after chemotherapy.”
   - **Answer:** She has too few neutrophils and bacteria detected in her blood after cancer treatment.
3. Audio: “The patient is septic with multiorgan dysfunction.”
   - **Answer:** The patient has a dangerous systemic response to infection affecting multiple organs.
4. Audio: “Pathology found extensive necrosis in the tissue.”
   - **Answer:** Disease specialists found extensive tissue death.
5. Audio: “He is immunosuppressed, so begin the infectious workup.”
   - **Answer:** His immune defenses are reduced, so the team is investigating infection.
6. Audio: “This may be viral, not bacterial; antibiotics would not target the cause.”
   - **Answer:** The suspected microbe is a virus, whereas antibiotics target bacteria.

### 13.9 Exit ticket

1. `onc/o` → **tumor/cancer specialty**
2. `carcin/o` → **cancer**
3. `cyt/o` → **cell**
4. `hist/o` → **tissue**
5. `necr/o` → **death/dead tissue**
6. `immun/o` → **immune defense**
7. `anti-` → **against/counteracting**
8. `meta-` in *metastatic cancer* → **spread beyond the original site**

Exit feedback:

> You can now follow the linguistic skeleton of many oncology and infection scenes while keeping crucial distinctions: mass is not automatically cancer, bacteremia is not identical to sepsis, and drug-class names describe targets rather than treatment decisions.

---

## 14. Session 9 — Reproduction, birth, time, and number

### 14.1 Outcomes

The learner can:

- recognize R35–R37, P07, and P10;
- distinguish female-reproductive specialty, uterus, pregnancy/birth, newborn, and breast roots;
- order prenatal/antenatal, antepartum, perinatal, neonatal, postpartum, and postnatal terms on a timeline;
- use number prefixes in clinical descriptions.

### 14.2 Minute-by-minute sequence

| Time | Activity |
| --- | --- |
| 0:00–0:06 | Cancer/infection retrieval |
| 0:06–0:12 | Reproduction and birth map |
| 0:12–0:27 | Cards R35–R37, P07, P10 |
| 0:27–0:38 | Timeline ordering |
| 0:38–0:48 | Word building and number matching |
| 0:48–0:56 | Listening: obstetric handoff |
| 0:56–1:00 | Exit ticket |

### 14.3 Retrieval warm-up

1. `neo-` + `plasm` → **new growth/neoplasm**
2. `meta-` + `stasis` in cancer → **spread to another site/metastasis**
3. `bacteri/o` + `-emia` → **bacteria in blood**
4. `immun/o` + suppression → **reduced immune activity**
5. `anti-` + coagulant → **acting against clotting**

### 14.4 Exact reproduction and birth map

Display:

> `gynec/o` names the female-reproductive specialty. `uter/o` and `hyster/o` point to the uterus. `mamm/o` and `mast/o` point to the breast.
>
> `obstetr/o` concerns pregnancy and childbirth. `nat/o` concerns birth; `neonat/o` concerns a newborn.
>
> The time prefixes do much of the decoding: before, around, or after birth.

Show R35–R37, P07, and P10.

### 14.5 Put the timeline in order

The learner arranges the tiles. Accept equivalent overlapping orderings where noted.

1. **prenatal / antenatal** — before birth; equivalent broad timing terms
2. **antepartum** — before delivery, especially the pregnancy period
3. **perinatal** — around the time of birth; overlaps late pregnancy and early newborn period
4. **neonatal** — pertaining to the newborn period
5. **postpartum** — after delivery, usually referring to the mother
6. **postnatal** — after birth, often referring broadly to baby or period after birth

Feedback:

> These periods overlap in real usage. The prefix still gives you the useful direction: before, around, or after birth.

### 14.6 Build the reproductive word

1. uterus + removal → `hyster/ectomy` → **hysterectomy**
2. uterus + visual examination → `hyster/o/scopy` → **hysteroscopy**
3. inside + uterus → `intra/uter/ine` → **intrauterine**
4. breast + record/image → `mamm/o/gram` → **mammogram**
5. breast + inflammation → `mast/itis` → **mastitis**
6. pregnancy/birth specialty → `obstetr/ics` → **obstetrics**
7. newborn specialty → `neonat/o/logy` → **neonatology**
8. after + delivery bleeding → `post/partum hem/o/rrhage` → **postpartum hemorrhage**

### 14.7 Number matching

1. `bilateral` → **both sides**
2. `monocyte` → **one-nucleus white-cell term**; the name is historical morphology, not a count of cells
3. `polyuria` → **much/excessive urine output**
4. `polycythemia` → **increased red-cell concentration/count condition**
5. `biventricular` → **involving both ventricles**
6. `multiorgan` → **involving many organs**
7. `monoplegia` → **paralysis of one limb**
8. `polyarthritis` → **inflammation of many joints**

### 14.8 Guest term: ectopic

Display:

> `ec-/ecto-` means outside or out of place, and `top/o` means place. An **ectopic pregnancy** is implanted outside the usual location in the uterus. This is a high-value whole term but not a full core family in this short course.

### 14.9 Listening: obstetric handoff

1. Audio: “Obstetrics is evaluating a possible ectopic pregnancy.”
   - **Answer:** The pregnancy/childbirth specialty is evaluating a pregnancy implanted outside the usual uterine location.
2. Audio: “She has heavy postpartum hemorrhage.”
   - **Answer:** She has severe bleeding after delivery.
3. Audio: “Neonatology will attend the delivery.”
   - **Answer:** The newborn specialty will be present for the birth.
4. Audio: “Ultrasound confirms an intrauterine pregnancy.”
   - **Answer:** The pregnancy is located within the uterus.
5. Audio: “The mammogram found bilateral masses.”
   - **Answer:** The breast images found masses on both sides.
6. Audio: “Gynecology recommends hysteroscopy before surgery.”
   - **Answer:** The female-reproductive specialty recommends visually examining the uterus before surgery.

### 14.10 Exit ticket

1. `gynec/o` → **female reproductive system/specialty**
2. `uter/o`, `hyster/o` → **uterus**
3. `obstetr/o` → **pregnancy and childbirth**
4. `neonat/o` → **newborn**
5. `mamm/o`, `mast/o` → **breast**
6. `pre-/ante-` → **before**
7. `post-` → **after**
8. `poly-` → **many or excessive**

Exit feedback:

> You have now learned all core body-root cards. Session 10 turns the endings of tests and procedures into a precise toolkit, then asks you to decode unfamiliar combinations.

---

## 15. Session 10 — Procedures, tests, specialists, and synthesis

### 15.1 Outcomes

The learner can:

- recognize S12–S18;
- distinguish removal, incision, opening, instrument, visual examination, record, recording process, puncture, tissue examination, breakdown, repair, stopping, specialty, and specialist;
- infer the target organ or structure from a procedure’s root;
- complete the cumulative final examination by transferring known parts to unfamiliar combinations.

### 15.2 Minute-by-minute sequence

| Time | Activity |
| --- | --- |
| 0:00–0:06 | Mixed retrieval |
| 0:06–0:20 | Cards S12–S18 |
| 0:20–0:32 | Procedure contrast lab |
| 0:32–0:40 | Listening: operating room and diagnostics |
| 0:40–1:05 | Forty-item final examination |
| 1:05–1:10 | Score, explanations, and next steps |

The final can be paused. Do not penalize the learner for taking longer than 25 minutes.

### 15.3 Mixed retrieval

1. heart → **`cardi/o`**
2. brain → **`encephal/o`, `cerebr/o`**
3. lung → **`pulmon/o`, `pneumon/o`**
4. liver → **`hepat/o`**
5. kidney → **`nephr/o`, `ren/o`**
6. bone / joint / muscle → **`oste/o`, `arthr/o`, `my/o`**
7. inflammation / disorder / mass → **`-itis`, `-pathy`, `-oma`**
8. without / difficult / fast / low → **`a-/an-`, `dys-`, `tachy-`, `hypo-`**

### 15.4 Exact procedure teaching text

Display:

> Procedure endings answer two questions:
>
> 1. **What action is happening?** Removal, incision, opening, viewing, recording, sampling, breaking, repairing, or stopping.
> 2. **Where is it happening?** The root names the organ or structure.
>
> Do not translate every procedure as “surgery.” The ending gives you a more precise mental picture.

Show S12–S18.

### 15.5 Procedure contrast lab

#### Removal, incision, or opening

| Term | What happens |
| --- | --- |
| tracheectomy | removal of part/all of the trachea; uncommon compared with related airway procedures |
| tracheotomy | incision into the trachea |
| tracheostomy | creation/maintenance of an opening into the trachea |
| colectomy | removal of all or part of the colon |
| colotomy | incision into the colon |
| colostomy | creation of an opening from the colon |

Display:

> `-ectomy` takes out. `-otomy` cuts into. `-stomy` creates an opening. Similar sound, different action.

#### Tool, act, result, or process

| Pair | Distinction |
| --- | --- |
| bronchoscope / bronchoscopy | viewing tool / act of visual examination |
| cystoscope / cystoscopy | viewing tool / act of visual examination |
| angiogram / angiography | image or record / process of making vessel images |
| mammogram / mammography | breast image / process of imaging the breast |
| cardiologist / cardiology | heart specialist / heart specialty |

#### Sample, break, repair, or stop

| Term | Literal action | Useful natural meaning |
| --- | --- | --- |
| thoracentesis | chest + puncture/withdrawal | puncture to remove or sample fluid from the chest/pleural space |
| biopsy | life/tissue + viewing | removal/sampling and examination of living tissue |
| thrombolysis | clot + breakdown | breaking/dissolving a clot |
| angioplasty | vessel + repair/reshaping | procedure to open/reshape a vessel |
| hemostasis | blood + stopping | stopping bleeding |
| homeostasis | same/steady + state | maintenance of stable internal conditions |

### 15.6 Choose the exact ending

1. Surgical removal of the kidney → **nephr + ectomy = nephrectomy**
2. Incision into the chest → **thorac + otomy = thoracotomy**
3. Created opening into the colon → **col + ostomy = colostomy**
4. Visual examination of a joint → **arthr + oscopy = arthroscopy**
5. Image/record of vessels → **angi + o + gram = angiogram**
6. Puncture to withdraw fluid from around the heart → **peri + cardi + o + centesis = pericardiocentesis**
7. Repair/reshaping of a vessel → **angi + o + plasty = angioplasty**
8. Specialist in nerves/nervous system → **neur + o + logist = neurologist**

### 15.7 Listening: operating room and diagnostics

1. Audio: “This requires laparotomy, not laparoscopy.”
   - **Answer:** The team plans an open incision into the abdomen, not a visual/minimally invasive scope procedure.
2. Audio: “Thoracentesis yielded bloody fluid.”
   - **Answer:** A chest/pleural puncture removed fluid that contained blood.
3. Audio: “Angiography shows a lesion suitable for angioplasty.”
   - **Answer:** Vessel imaging shows an abnormal area that may be treated by opening/reshaping the vessel.
4. Audio: “Send the biopsy to pathology.”
   - **Answer:** Send the tissue sample to the disease/tissue laboratory for examination.
5. Audio: “Hemostasis was achieved before closure.”
   - **Answer:** The bleeding was stopped before the operation was closed.
6. Audio: “Neurology ordered electroencephalography.”
   - **Answer:** The nervous-system specialty ordered recording of the brain’s electrical activity.

Display before the exam:

> You are ready when you can say “I do not know the exact diagnosis, but I know what the pieces are telling me.” That is disciplined inference, not guessing.

---

## 16. Final examination

### 16.1 Instructions shown to the learner

> **Final: Decode the dialogue**
>
> There are 40 questions. You may replay audio twice. Spelling is not scored unless you are assembling visible word-part tiles.
>
> - 36–40: transfer mastery
> - 32–35: course mastery
> - 24–31: developing; review the suggested cards and retry
> - 0–23: rebuild the foundation; no penalty and no locked content
>
> The exam is educational, not a health-care credential.

### 16.2 Part A — Hear the term and choose its useful meaning

For each item, play the audio without initially showing the term.

1. Audio: “bradycardia”
   - A. slow heart rate
   - B. fast breathing
   - C. heart inflammation
   - D. low blood sugar
2. Audio: “meningoencephalitis”
   - A. removal of the skull
   - B. inflammation of meninges and brain
   - C. nerve pain
   - D. tumor of bone marrow
3. Audio: “hematuria”
   - A. too little blood
   - B. urine in blood
   - C. blood in urine
   - D. heavy menstrual bleeding
4. Audio: “nephrectomy”
   - A. visual examination of a kidney
   - B. kidney inflammation
   - C. incision into the bladder
   - D. surgical removal of a kidney
5. Audio: “bronchoscopy”
   - A. recording of breathing
   - B. visual examination of bronchial airways
   - C. removal of a lung
   - D. repair of the chest wall
6. Audio: “metastatic adenocarcinoma”
   - A. benign collection of blood
   - B. gland inflammation before birth
   - C. gland-forming cancer that has spread
   - D. bacterial disease of a vessel
7. Audio: “thrombocytopenia”
   - A. too many red cells
   - B. clot dissolved by treatment
   - C. blood outside a vessel
   - D. too few platelets
8. Audio: “postpartum hemorrhage”
   - A. heavy bleeding after delivery
   - B. difficult breathing before birth
   - C. uterine examination during pregnancy
   - D. low blood pressure in a newborn

### 16.3 Part B — Decode the visible parts

9. `peri / card / itis`
   - A. enlargement within the heart
   - B. recording across a vessel
   - C. inflammation around the heart
   - D. heart removal
10. `hypo / glyc / emia`
   - A. high sugar in urine
   - B. low blood sugar
   - C. blood in urine
   - D. low urine output
11. `gastr / o / enter / o / logy`
   - A. inflammation of stomach and colon
   - B. removal of the stomach
   - C. intestinal pain
   - D. specialty concerning stomach and intestines
12. `oste / o / myel / itis`
   - A. inflammation/infection involving bone and marrow
   - B. spinal-cord tumor
   - C. joint pain
   - D. muscle weakness
13. `sub / cutane / ous`
   - A. across the skin
   - B. beneath the skin
   - C. above a bone
   - D. within a vessel
14. `poly / arthr / itis`
   - A. pain in one muscle
   - B. repair of two bones
   - C. inflammation of many joints
   - D. condition of the entire spine
15. `cardi / o / my / o / pathy`
   - A. nerve disorder affecting the heart
   - B. blood around a muscle
   - C. heart image
   - D. disorder of heart muscle
16. `thorac / o / centesis`
   - A. puncture to remove/sample fluid from the chest
   - B. incision into the chest
   - C. chest imaging process
   - D. chest repair
17. `hyster / o / scopy`
   - A. removal of the uterus
   - B. uterine pain
   - C. visual examination of the uterus
   - D. inflammation around a newborn
18. `immun / o / suppression`
   - A. reduction of immune activity
   - B. increased white-cell count
   - C. bacterial spread in blood
   - D. tissue death

### 16.4 Part C — Build the term from tiles

Distractor tiles should be shown but are omitted here from the answer sequence.

19. kidney + inflammation → **`nephr/itis`**
20. below normal + sugar + blood condition → **`hypo/glyc/emia`**
21. colon + visual examination → **`colon/o/scopy`**
22. gallbladder + surgical removal → **`cholecyst/ectomy`**
23. fast + breathing → **`tachy/pnea`**
24. liver + enlargement → **`hepat/o/megaly`**
25. nerve + pain → **`neur/algia`**
26. new + growth → **`neo/plasm`**

### 16.5 Part D — Infer from dramatic context

27. “The CT shows an expanding intracranial hematoma.” What is expanding?
   - A. a clot inside a vein
   - B. inflammation around the heart
   - C. a lung tumor
   - D. a collection of blood inside the skull
28. “She is bacteremic and now septic.” Which distinction is best?
   - A. her blood has no bacteria, but her urine does
   - B. both words mean an ordinary fever
   - C. bacteria were detected in blood, and she now has a dangerous systemic response to infection
   - D. the first means viral and the second bacterial
29. “Cardiology suspects cardiogenic shock.” What does the wording suggest?
   - A. the brain is causing slow breathing
   - B. the heart’s function is causing the shock state
   - C. a blood cancer is causing pain
   - D. the kidneys are producing too much urine
30. “A large pleural effusion is compressing the lung. Prepare for thoracentesis.” What will the named procedure do?
   - A. puncture the chest/pleural space to remove or sample fluid
   - B. remove the entire lung
   - C. inspect the stomach
   - D. repair a heart vessel
31. “The patient has left hemiparesis, not hemiplegia.” What correction is being made?
   - A. paralysis of both legs, not one arm
   - B. nerve pain, not brain inflammation
   - C. weakness on one side, not complete paralysis
   - D. mental illness, not a physical symptom
32. “Urology is treating urosepsis, and urine output has fallen to oliguria.” What can you infer?
   - A. there is too much sugar in urine
   - B. the bladder has been removed
   - C. the kidneys are enlarged but normal
   - D. urinary infection is associated with a dangerous systemic response, and urine output is low
33. “The biopsy confirms metastatic carcinoma.” What does *metastatic* add?
   - A. the mass is definitely benign
   - B. the cancer has spread beyond its original site
   - C. the tissue is infected by bacteria
   - D. the tumor has been removed
34. “Neonatology is present because the infant may need postnatal support.” Who and when?
   - A. the newborn team, after birth
   - B. the heart team, before surgery
   - C. the maternal team, before pregnancy
   - D. the cancer team, during biopsy

### 16.6 Part E — Transfer to combinations not explicitly practiced

35. `dermat/o/myos/itis` (*dermatomyositis*) most plausibly means:
   - A. skin tumor around a nerve
   - B. inflammation involving skin and muscle
   - C. muscle removal through the skin
   - D. spinal-cord disease
36. `cardi/o/pulmon/ary` (*cardiopulmonary*) most plausibly concerns:
   - A. blood and kidneys
   - B. brain and spine
   - C. stomach and intestine
   - D. heart and lungs
37. `hepat/o/ren/al` (*hepatorenal*) most plausibly concerns:
   - A. gallbladder and urine
   - B. liver and lungs
   - C. liver and kidneys
   - D. blood and heart
38. `endo/my/o/cardi/al biopsy` (*endomyocardial biopsy*) most plausibly samples:
   - A. tissue from inside the heart muscle
   - B. fluid around the lung
   - C. bone marrow inside a vertebra
   - D. a vessel under the skin
39. `oste/o/necr/osis` (*osteonecrosis*) most plausibly means:
   - A. bone enlargement
   - B. joint inflammation
   - C. muscle pain
   - D. bone tissue death
40. Given the guest ending `-cele` = protrusion, `mening/o/myel/o/cele` most plausibly means:
   - A. brain electrical recording
   - B. protrusion involving meninges and spinal cord
   - C. removal of bone marrow
   - D. inflammation of a nerve and muscle

### 16.7 Final examination answer key and feedback map

| Items | Correct answers |
| --- | --- |
| 1–8 | 1 A; 2 B; 3 C; 4 D; 5 B; 6 C; 7 D; 8 A |
| 9–18 | 9 C; 10 B; 11 D; 12 A; 13 B; 14 C; 15 D; 16 A; 17 C; 18 A |
| 19–26 | 19 `nephr/itis`; 20 `hypo/glyc/emia`; 21 `colon/o/scopy`; 22 `cholecyst/ectomy`; 23 `tachy/pnea`; 24 `hepat/o/megaly`; 25 `neur/algia`; 26 `neo/plasm` |
| 27–34 | 27 D; 28 C; 29 B; 30 A; 31 C; 32 D; 33 B; 34 A |
| 35–40 | 35 B; 36 D; 37 C; 38 A; 39 D; 40 B |

The location of correct choices may be shuffled in the application. Preserve the answer meaning, not the letter.

Assign targeted review from missed items:

| Missed items | Review |
| --- | --- |
| 1, 7, 9, 15, 23, 29 | Session 2 and P04/R01/R05 |
| 2, 27, 31, 40 | Session 3 and R06–R09/S11 |
| 5, 30, 36 | Session 4 and R11–R14/S07 |
| 11, 22, 24, 37 | Sessions 5–6 and R15–R23 |
| 12–14, 35, 39 | Session 7 and R24–R28 |
| 6, 18, 26, 28, 33 | Session 8 and R29–R34/P11 |
| 8, 17, 34 | Session 9 and R35–R37/P07 |
| 4, 16, 19–25, 30, 38 | Session 10 and S12–S18 |

Display after scoring:

> **Your score reflects decoding, not medical expertise.**
>
> Watch for a term in your next medical drama. Pause after you hear it. Say the likely body root and ending before turning on subtitles. That is the real transfer test.

---

## 17. Bonus — Other Medical Terms You Should Know

This bonus appears **only after the learner submits the final examination**. It is optional, unscored, and does not change course completion.

Display:

> **Roots are powerful, but hospital speech also runs on shorthand.**
>
> The following expressions are common in medical dramas and are better learned as whole units. Some are abbreviations, some are ordinary English used in a special way, and some are historical words that do not decode cleanly.
>
> You do not need to memorize this list today. Use it as a subtitle companion.

### 17.1 People, places, and workflow

| Term | What it usually means in hospital dialogue |
| --- | --- |
| attending | fully trained physician supervising a patient’s care and often supervising trainees |
| resident | physician training in a specialty after medical school |
| intern | first-year resident in common US usage |
| fellow | physician receiving advanced subspecialty training after residency |
| medical student / med student | student who has not yet qualified as a physician |
| charge nurse | nurse coordinating a unit or shift |
| paramedic | prehospital clinician providing emergency care and transport |
| consult | request for another specialist’s evaluation; also the specialist’s response |
| service | clinical team or specialty responsible for care, as in “the trauma service” |
| rounds | structured visits/discussion in which a team reviews patients |
| sign-out / handoff | transfer of patient information and responsibility between clinicians |
| admit | bring a patient into the hospital for inpatient care |
| discharge | release a patient from a care setting with a plan |
| transfer | move a patient to another unit or facility |
| OR | operating room |
| ED / ER | emergency department / emergency room |
| ICU | intensive care unit |
| CCU | coronary/cardiac care unit or critical care unit, depending on the hospital |
| chart | the patient’s medical record |
| orders | clinician instructions for tests, monitoring, medications, diet, or care |

### 17.2 Reasoning phrases

| Phrase | Useful meaning |
| --- | --- |
| differential / differential diagnosis | ranked or unranked list of possible explanations |
| diagnosis | identified disease or condition |
| prognosis | expected course or outcome |
| workup | tests and evaluation used to investigate a problem |
| rule out | investigate and try to exclude; it does **not** mean already excluded |
| positive | a test found the target finding; whether that is good or bad depends on the test |
| negative | a test did not find the target finding; it does not always mean “healthy” |
| unremarkable | no notable abnormality was seen in the described area |
| history of | the patient previously had or has an established condition |
| status post | after a prior procedure or event, often abbreviated `s/p` in writing |
| acute | sudden/recent in onset or short in duration; not simply “very bad” |
| chronic | persisting over time; not simply “incurable” |
| idiopathic | cause is unknown |
| iatrogenic | caused by medical care or a medical intervention |
| contraindicated | a treatment/test should generally not be used in that situation because of risk |

### 17.3 Urgency, status, and bedside actions

| Term or phrase | Useful meaning |
| --- | --- |
| vitals / vital signs | basic measures such as pulse, blood pressure, breathing rate, temperature, and oxygen saturation |
| stable | not currently changing in a dangerous way; it does not mean healthy |
| unstable | at meaningful risk of deterioration or already deteriorating |
| crashing | rapidly becoming critically unstable |
| altered | changed mental status, awareness, or behavior |
| code blue | local emergency call usually indicating cardiac or respiratory arrest |
| cardiac arrest | the heart is not effectively pumping blood; not the same as a heart attack |
| CPR | cardiopulmonary resuscitation |
| defibrillate / shock | deliver an electrical shock for certain abnormal rhythms; not every arrest rhythm is shockable |
| shock | dangerous failure of circulation to supply organs; may also mean an electrical shock in a different sentence |
| airway | route through which air reaches the lungs |
| intubate | place a tube into the airway, usually the trachea |
| ventilator / vent | machine that supports breathing |
| bag / bagging | manually assist breaths with a bag-mask device |
| IV | intravenous line/access |
| central line | catheter placed into a large central vein |
| push | give a medication directly over a short period, commonly through IV access |
| bolus | a relatively concentrated dose or volume given over a short period |
| drip / infusion | fluid or medication delivered gradually |
| stat | immediately; from Latin *statim* |
| NPO | nothing by mouth |

### 17.4 Measurements, laboratory shorthand, and imaging

| Spoken or written form | Meaning |
| --- | --- |
| BP | blood pressure |
| heart rate / HR / pulse | number of heartbeats per minute; pulse can also describe the felt arterial beat |
| respiratory rate / RR | breaths per minute |
| temp | temperature |
| oxygen saturation / O2 sat / sats / SpO2 | estimated percentage of oxygen-saturated hemoglobin |
| GCS | Glasgow Coma Scale, a score describing eye, verbal, and motor responses |
| CBC | complete blood count |
| WBC / white count | white-blood-cell count |
| hemoglobin / Hgb | oxygen-carrying blood protein and the commonly reported concentration |
| hematocrit / Hct | proportion of blood volume occupied by red cells |
| platelets | cell fragments involved in clotting |
| BMP / CMP | basic/comprehensive metabolic panel; groups of chemistry tests |
| electrolytes | charged substances such as sodium and potassium measured in blood |
| creatinine | common blood marker used in evaluating kidney filtration |
| glucose | blood sugar measurement |
| troponin | blood marker used when evaluating heart-muscle injury |
| lactate | blood marker that can rise with impaired tissue oxygen delivery and other stresses |
| cultures | tests intended to identify microorganisms from blood, urine, or other samples |
| urinalysis / UA | laboratory examination of urine |
| X-ray | imaging using ionizing radiation |
| CT / CAT scan | computed tomography, cross-sectional X-ray imaging |
| MRI | magnetic resonance imaging |
| ultrasound / sono | imaging using sound waves |
| ECG / EKG | electrocardiogram, recording of the heart’s electrical activity |
| EEG | electroencephalogram, recording of the brain’s electrical activity |

### 17.5 High-frequency conditions and findings learned as whole forms

| Term | Useful meaning |
| --- | --- |
| stroke | sudden brain injury from blocked blood flow or bleeding |
| heart attack / MI | injury/death of heart muscle from loss of blood supply; `MI` means myocardial infarction |
| seizure | episode of abnormal electrical activity in the brain producing changes in movement, sensation, behavior, or awareness |
| asthma | chronic airway condition with variable narrowing/inflammation |
| diabetes | group of disorders involving high blood glucose regulation problems |
| HIV | human immunodeficiency virus |
| AIDS | acquired immunodeficiency syndrome |
| pneumonia | infection/inflammation of lung tissue; the `pneumon/o` clue helps, but learn the whole word |
| trauma | physical injury or the clinical service treating serious injury |
| fracture | broken bone |
| sprain | ligament injury |
| strain | muscle or tendon injury |
| dislocation | joint surfaces displaced from normal alignment |
| laceration | cut or tear in tissue |
| contusion | bruise |
| bleed | ordinary spoken term for hemorrhage |
| clot | ordinary spoken term often corresponding to thrombus |
| embolism / embolus | material traveling through circulation and blocking a vessel; often a clot, but not always |
| PE | pulmonary embolism in most emergency dialogue; abbreviation can be ambiguous in other contexts |
| aneurysm | abnormal localized widening of a vessel or heart wall |
| edema | swelling caused by fluid in tissues |
| lesion | general term for an abnormal area of tissue |
| mass | abnormal lump/space-occupying finding; not automatically cancer |
| abscess | localized collection of pus from infection |
| obstruction | blockage |
| perforation | abnormal hole through the wall of an organ |
| effusion | abnormal fluid collection in a body space |
| sepsis | dangerous, dysregulated whole-body response to infection causing organ dysfunction |

### 17.6 Medication names and classes likely to be heard

The subtitle study described in Section 2.2 found **morphine**, **atropine**, and **lidocaine** to be its three most-mentioned individual drugs across *ER* and *Grey’s Anatomy*. Learn these as names, not as roots.

| Term | What the name signals in dialogue |
| --- | --- |
| morphine | opioid pain medicine |
| atropine | medicine heard in resuscitation and several other settings; often associated in drama with treating certain slow heart rates |
| lidocaine | local anesthetic and, in some settings, antiarrhythmic medicine |
| epinephrine / epi | adrenaline; heard in resuscitation and severe allergic-reaction scenes among other uses |
| insulin | hormone/medicine that lowers blood glucose by enabling glucose uptake and storage |
| heparin | anticoagulant |
| aspirin | analgesic/antipyretic with antiplatelet effects; context determines why it is mentioned |
| antibiotic | medicine targeting bacteria |
| antiviral | medicine targeting viruses |
| analgesic | pain-relieving medicine |
| anesthetic | medicine producing loss of sensation, with or without loss of consciousness |
| sedative | medicine that calms or reduces consciousness |
| anticoagulant | medicine that reduces clot formation/growth |
| vasopressor | medicine that constricts vessels and/or supports blood pressure |

### 17.7 Obstetric whole forms

| Term | Useful meaning |
| --- | --- |
| labor | physiologic process leading to birth |
| contraction | tightening of uterine muscle; context distinguishes labor from other contractions |
| delivery | birth of the baby and, in a broader clinical phrase, associated care |
| fetus | developing offspring after the embryonic period and before birth |
| placenta | organ connecting fetal and maternal circulation without directly mixing their blood under normal conditions |
| miscarriage | pregnancy loss before the threshold locally defined as stillbirth |
| C-section / cesarean section | surgical delivery through abdominal and uterine incisions |
| ectopic pregnancy | pregnancy implanted outside the usual uterine cavity |

### 17.8 Shorthand listening traps

Display one card at a time:

1. **“sat” versus “stat”** — “His sat is 88” refers to oxygen saturation. “Get CT stat” means immediately.
2. **“epi”** — In a drug order, this often means epinephrine. Inside *epidural* or *epigastric*, `epi-` means upon/above.
3. **“MI”** — In cardiac dialogue, myocardial infarction/heart attack. Do not assume every two-letter abbreviation is universal.
4. **“PE”** — Often pulmonary embolism in emergency dialogue; it can mean physical examination elsewhere.
5. **“negative”** — “Troponin is negative” means the marker was not detected/elevated by that test, not that every heart problem is excluded.
6. **“stable”** — A patient can be stable and still be critically ill.
7. **“rule out”** — “Rule out stroke” means stroke remains under investigation.
8. **“shock”** — The circulatory condition and an electrical defibrillator shock are different meanings.

### 17.9 Optional bonus scene

Play the fictional scene line by line. The learner taps any unfamiliar whole-form term to reveal its bonus definition.

> **Paramedic:** “Fifty-eight-year-old with sudden chest pain. BP is 82 over 50, pulse 128, sats 91%.”
>
> **Resident:** “He is hypotensive and tachycardic. Get an ECG and a troponin stat. Two IVs.”
>
> **Attending:** “Keep MI and PE on the differential. Start the workup and call cardiology.”
>
> **Nurse:** “ECG is up. He is becoming altered.”
>
> **Attending:** “He is unstable. Prepare to transfer to the ICU.”

Questions:

1. Which two classical pieces describe the current vital signs? — **`hypo-` + tension; `tachy-` + cardia**
2. What does `stat` add? — **Do it immediately.**
3. What are the two possible diagnoses abbreviated? — **Myocardial infarction and pulmonary embolism.**
4. Does “on the differential” mean either diagnosis is confirmed? — **No. They are possibilities under consideration.**
5. What does `altered` imply? — **A change in mental status/awareness.**

End the curriculum with:

> **You now have two complementary tools:** classical word-part decoding and a compact set of hospital whole forms. Use roots for inference; use context to choose among meanings; use subtitles or a dictionary when precision matters.

---

# Implementation appendices

## 18. Product requirements document

### 18.1 Product summary

Build a small, static, listening-first medical-terminology learning app from the canonical content in this file. The app should feel closer to a focused vocabulary trainer than a learning-management system.

The default user never creates an account. They open the site, study ten sessions, complete short interactions, and keep progress in their browser. A freeCodeCamp account may optionally sync progress **only by reusing a browser-safe authentication and progress facility already present in the repository**.

### 18.2 Product goals

1. Help a general adult infer the broad meaning of high-yield medical compounds heard in English-language hospital dramas.
2. Complete the core course in approximately ten hours.
3. Work well on desktop and mobile, with mouse, touch, keyboard, and screen reader.
4. Load as static files from GitHub Pages.
5. Remain useful with no account, no server, no database, and no network after the initial page load.
6. Make progress durable in the current browser and optionally sync through existing freeCodeCamp infrastructure.

### 18.3 Explicit non-goals

- Teaching diagnosis, treatment, anatomy in depth, pharmacology, clinical documentation, or professional competency.
- Awarding a medical credential or claiming CE/CME credit.
- Reproducing scenes or substantial dialogue from copyrighted television scripts.
- Adding a custom backend, database, serverless functions, CMS, learning-management system, or new authentication service.
- Adding React—or replacing the repository’s existing UI stack—merely to implement this course.
- Collecting symptoms, health information, learner free text, or other sensitive medical data.
- Requiring perfect spelling before granting course completion.

### 18.4 Repository-first engineering instruction

This requirement is controlling:

> **Before coding, inspect the repository containing this PRD. Read its `AGENTS.md`, `package.json`, lockfile, source tree, build/deploy configuration, styles, components, tests, authentication utilities, and other curriculum apps. Reuse what is already there. Do not introduce a framework, router, state library, drag-and-drop package, Markdown parser, test framework, backend, or design system unless the repository already uses it.**

Apply these branches:

- If the repository is plain HTML/CSS/JavaScript, keep it plain.
- If the repository already uses Vite + TypeScript, stay within that stack.
- If it already uses a component framework, use its existing components; do not add a second framework.
- If it already contains a standard freeCodeCamp learning-app shell, progress API, or auth client, reuse those exact patterns.
- If it has no test runner, do not install one solely for this app. Add a small dependency-free validation script only if the existing build environment makes that natural; otherwise use the manual QA list in Section 21.
- If browser-safe freeCodeCamp sign-in/sync does not already exist, do not invent OAuth, embed a secret, or create a server. Complete the local app, preserve a narrow sync interface, and report the missing integration as a blocker for account sync.

### 18.5 Required screens/states

| Screen/state | Required content |
| --- | --- |
| Course home | Title, outcome, time estimate, safety statement, Continue/Start button, ten-session outline, local-progress notice, optional sign-in control if supported |
| Session overview | Outcomes, approximate time, new-card IDs, prior retrieval summary |
| Learn card | Family, meaning, sound cue, coach line, five active examples, expandable additional examples, audio button |
| Practice | Matching, multiple choice, fill-the-blank choices, word-part tile builder, and contextual listening prompts defined in the lesson |
| Exit ticket | Exact lesson items, immediate explanatory feedback, retry option |
| Progress | Sessions completed, current session, cards by mastery level, final score if attempted, reset-local-progress control with confirmation |
| Final exam | Forty exact items from Section 16, progress indicator, pause/resume, score, targeted review links |
| Bonus | Locked only until the first final submission; searchable/expandable reference groups from Section 17 |

No screen should require sign-in. Do not hard-lock later sessions; recommend sequence but permit navigation.

### 18.6 Required interaction primitives

Use the smallest implementation that fits the existing stack.

1. **Reveal card:** show cue, let the learner think, then reveal meaning and examples.
2. **Match:** select one item in each column; no drag library.
3. **Multiple choice:** one answer, immediate feedback, explanation.
4. **Word-part builder:** tiles can be clicked/tapped to move into an answer row and moved back. Keyboard users can focus a tile and use clearly labeled Move/Add/Remove controls. Pointer dragging is optional enhancement, never the only input.
5. **Listening choice:** play a term or sentence; keep transcript hidden until the learner answers or chooses “Show transcript.” Allow replay.
6. **Timeline reorder:** implement with up/down or before/after controls; pointer drag is optional.
7. **Expandable reference:** native `<details>` is acceptable if it matches the existing styles.

Do not add animation beyond brief existing transitions. Honor `prefers-reduced-motion`.

### 18.7 Audio requirement without new dependencies

Listening is central, but v1 should not require an audio pipeline.

- Use the browser Web Speech API (`window.speechSynthesis`) when available.
- Set utterances to `lang = "en-US"` and a default `rate` around `0.85`; expose Normal and Slower controls if this can be done without clutter.
- Speak the exact audio strings in the lessons. Do not speak slash notation.
- Call `speechSynthesis.cancel()` before starting a new utterance.
- Provide the written transcript after the answer and an always-available “Show transcript” accessibility option.
- If speech synthesis is unavailable, show the transcript and keep the activity completable.
- Do not attempt phoneme-level synthesis or add a third-party TTS SDK.

Because operating-system voices pronounce some medical terms inconsistently, retain the human-readable sound cues on cards. A later version may replace selected TTS terms with reviewed audio files without changing lesson content.

### 18.8 Curriculum/content model

This Markdown file is the editorial source of truth. Do not add a runtime Markdown parser merely to consume it. Translate it at implementation time into the repository’s ordinary static content format.

Minimum conceptual types:

```ts
type CardId = `P${string}` | `S${string}` | `R${string}`;

interface WordPartCard {
  id: CardId;
  forms: string[];
  meaning: string;
  origin: "Greek" | "Latin" | "Mixed";
  soundCue: string;
  coachLine: string;
  activeExamples: string[];      // exactly the bold examples in Section 4
  recognitionExamples: string[]; // remaining examples in Section 4
}

interface Question {
  id: string;
  type: "choice" | "match" | "builder" | "listen" | "order";
  prompt: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  reviewCardIds: CardId[];
}

interface Lesson {
  id: string;
  number: number;
  title: string;
  estimatedMinutes: number;
  outcomes: string[];
  newCardIds: CardId[];
  reviewCardIds: CardId[];
  sections: unknown[]; // refine to existing repository conventions
  exitQuestionIds: string[];
}
```

Requirements:

- IDs in this document are stable and must not be silently renumbered.
- Give numbered lesson items the deterministic ID `q-s{section-digits}-i{two-digit-item}`. For example, item 1 in Section 6.3 is `q-s063-i01`, and item 3 in Section 10.7 is `q-s107-i03`. Number table rows in reading order when a table itself is an answerable matching activity. Final-exam items use `q-final-01` through `q-final-40`. Freeze these IDs after release; do not derive IDs from editable prompt prose.
- Every displayed question needs a deterministic correct answer and explanatory feedback.
- Where a lesson supplies an answer but no separate feedback sentence, the bold answer or correct table cell is the canonical explanation. Use exactly: “Correct: {answer}.” after a correct response and “Not yet. The answer is {answer}.” after an incorrect response, followed by the relevant card link. Do not invent extra clinical claims merely to lengthen feedback.
- Audio text and visible transcript must be identical except for pronunciation markup not meant to be spoken.
- Shuffle multiple-choice positions, not semantic content. Do not make every correct option visually land in the same position, as this Markdown necessarily does in some sections.
- Preserve the distinction between five active examples and recognition examples.

### 18.9 Progress behavior

Use one versioned, namespaced key unless the repository already provides a convention:

`fcc-medical-terminology-decoder:progress:v1`

Suggested minimal shape:

```ts
interface LocalProgressV1 {
  schemaVersion: 1;
  contentVersion: "2026-07-31";
  updatedAt: string;
  currentLessonId: string | null;
  lessons: Record<string, {
    started: boolean;
    completed: boolean;
    completedAt?: string;
    exitBestCorrect: number;
    exitTotal: number;
  }>;
  cards: Partial<Record<CardId, {
    seen: boolean;
    recognitionCorrect: number;
    contextCorrect: number;
    transferCorrect: number;
    level: "seen" | "familiar" | "usable" | "transfer";
  }>>;
  finalExam: {
    attempts: number;
    lastScore: number | null;
    bestScore: number | null;
    submittedAt?: string;
  };
  bonusUnlocked: boolean;
}
```

Rules:

- Save after each answered interaction and navigation event worth preserving; debounce only if the existing codebase already has a utility.
- Treat parse errors or unknown versions as recoverable. Offer a reset rather than crashing.
- A lesson is complete after its required interactions and exit ticket are submitted. Do not require a passing score to navigate onward.
- The bonus unlocks after any submitted final attempt, regardless of score.
- Reset requires an explicit confirmation and affects local course progress only.
- Store no health data, free-response prose, audio recordings, or complete per-answer history.

### 18.10 Optional freeCodeCamp sign-in and sync

Authentication and sync are progressive enhancement.

1. Search the existing repository for the canonical freeCodeCamp auth client, login button, callback handling, user identity, and progress API.
2. Reuse those modules and UI patterns exactly. Do not add client secrets or a new OAuth application flow.
3. Keep local progress as the immediate offline source. After authenticated sync succeeds, merge local and remote progress.
4. Merge monotonically:
   - completed lesson = completed on either side;
   - card counters = maximum of local and remote, capped at any existing sensible maximum;
   - mastery level = higher achieved level;
   - final best score = maximum;
   - attempts may use the higher value rather than summing to avoid double-counting;
   - bonus unlocked = true on either side.
5. Send only this course’s progress object and the minimum identity already supplied by the existing auth layer.
6. If sync fails, retain local changes, show a quiet retry message, and never block study.
7. If no compatible repository capability exists, leave an internal adapter boundary such as `loadRemoteProgress`, `saveRemoteProgress`, and `onAuthChanged`, but do not show a fake working sign-in button.

### 18.11 GitHub Pages and static-hosting requirements

- The production output must consist only of static files.
- Use relative asset paths or the repository’s existing configurable base path so project-site deployments such as `https://example.github.io/repository-name/` work.
- Prefer the existing routing approach. If none exists, use a single page and hash/state navigation; do not add a router dependency.
- Refreshing or directly opening the course home must work on GitHub Pages without rewrite rules.
- The app should remain usable offline after its static files have loaded. Do not add a service worker unless the repository already uses one.
- Do not add environment variables for core local functionality.

### 18.12 Accessibility requirements

- All interactions work by keyboard alone.
- All controls have accessible names and visible focus styles.
- Word-part colors, if used, are redundant with text labels such as Prefix, Root, and Suffix.
- Audio always has a transcript.
- Feedback is announced through an appropriate live region without moving focus unexpectedly.
- Touch targets are at least 44 by 44 CSS pixels where practical.
- Do not impose a timer on the final exam.
- Do not use drag-and-drop as the only way to answer.
- Use semantic headings, lists, buttons, fieldsets, legends, and tables.

### 18.13 Visual direction

Follow the host repository. If it has no established course style, use a restrained layout:

- one centered reading column;
- high-contrast text;
- compact progress bar and session navigation;
- word-part tiles with a border and text label;
- no anatomical stock art required for v1;
- no gamified currency, streak pressure, confetti, avatars, or elaborate dashboard.

The experience should feel calm, fast, and legible—closer to a well-edited handbook with exercises than a game.

### 18.14 Privacy and analytics

- Add no third-party analytics, advertising, cookies, or trackers.
- If the repository already has first-party analytics, use its established event helper and collect only coarse events such as lesson started/completed and final submitted. Never send answer text or inferred medical interests.
- Explain local progress in one sentence on the home/progress screen.

### 18.15 Content and safety review before public launch

Before release, the complete learner-visible curriculum should receive:

1. an editorial pass for consistency of slash notation, pronunciation cues, US English, and answer feedback;
2. a terminology review by at least one qualified clinician, medical educator, or experienced allied-health terminology instructor;
3. an accessibility review of every interaction type;
4. a copyright check confirming all dramatic dialogue is original and no subtitle/script corpus text is shipped.

The safety statement must remain visible on the course home and in the final result. Do not add treatment recommendations.

---

## 19. Codex implementation brief

This is the prompt to give Codex from the repository root:

> Read every applicable `AGENTS.md` and inspect the existing repository before changing anything. This repository should contain `medical-terminology-roots-curriculum-and-prd.md`; treat it as the canonical content and requirements source.
>
> Implement the smallest static learning app that satisfies Sections 18–21 of that file. Reuse the repository’s existing stack, components, styles, test tools, auth client, progress API, and deployment conventions. Do not add React or any other framework if it is not already present. Do not add a router, state library, drag-and-drop library, Markdown runtime, backend, database, serverless function, new OAuth flow, or new design system.
>
> The app must work without an account, persist versioned progress in `localStorage`, use accessible click/tap/keyboard word-part tiles, use browser speech synthesis with transcript fallback for listening items, include all ten sessions and the exact final exam, unlock the unscored bonus after final submission, and build correctly for GitHub Pages under a repository subpath.
>
> Search for existing freeCodeCamp sign-in and progress-sync facilities. If they exist, integrate them through the repository’s established patterns. If they do not, do not invent a backend or put secrets in the browser; keep the local app complete, create only a narrow internal sync adapter boundary, and clearly report account sync as the remaining blocker.
>
> Preserve unrelated work. Add no dependencies unless an already-present repository requirement makes one unavoidable. Validate content IDs, answer keys, local progress recovery, mobile/keyboard operation, audio fallback, refresh behavior, and the production build. Report the files changed, tests/build run, and any remaining limitation.

---

## 20. Content integrity checks

If the existing repository has a test or script convention, add dependency-free checks for the following. Otherwise perform them manually and document the results.

1. All P, S, and R card IDs are unique.
2. There are 11 prefix cards, 18 suffix cards, and 37 root cards.
3. Every family has at least ten listed examples or is marked/documented as an exception.
4. Every lesson references existing card IDs.
5. Every question has a stable ID, type, prompt, correct answer, explanation, and review mapping.
6. Final exam contains exactly 40 scorable items.
7. Final answer choice order may shuffle without losing the correct-answer mapping.
8. Every listening item has identical `audioText` and transcript content.
9. Every word builder can be completed without pointer dragging.
10. `localStorage` parsing handles missing, malformed, and future-version data without a blank screen.
11. Bonus unlocks after any final submission and not before.
12. No copied television dialogue appears in shipped content.

---

## 21. Acceptance checklist

### Curriculum

- [ ] All exact teaching text from Sections 6–17 is represented.
- [ ] All 66 canonical families are available in their assigned sessions.
- [ ] Active examples and recognition examples remain distinct.
- [ ] Lesson exercises use the specified answers and feedback.
- [ ] The 40-item final scores correctly and maps misses to review.
- [ ] The bonus appears only after final submission and never affects completion.

### Interaction

- [ ] Matching works by click/tap and keyboard.
- [ ] Word building works by click/tap and keyboard; drag is optional.
- [ ] Listening works through speech synthesis where available.
- [ ] Every listening item has a transcript fallback.
- [ ] Learners can pause, leave, refresh, and continue.
- [ ] Later sessions remain navigable without forced mastery gates.

### Persistence and account behavior

- [ ] The app works entirely while signed out.
- [ ] Progress survives refresh in the same browser.
- [ ] Corrupted saved state has a recoverable reset path.
- [ ] Optional sign-in uses only existing repository infrastructure.
- [ ] Sync failure never discards local progress or blocks study.

### Hosting and quality

- [ ] Production build uses only static output.
- [ ] Assets work from a GitHub Pages repository subpath.
- [ ] Direct home load and refresh work without server rewrites.
- [ ] No unnecessary dependency or framework was added.
- [ ] Existing lint/test/build checks pass.
- [ ] Manual mobile, keyboard, screen-reader-smoke, reduced-motion, and no-speech-synthesis checks pass.
- [ ] A qualified medical terminology reviewer approves learner-visible definitions before public launch.

---

## 22. Editorial maintenance rules

1. Add a new core family only after documenting ten useful terms or an explicit high-frequency exception.
2. Prefer a term that reuses several existing parts over a rare term that introduces three new parts.
3. Keep active examples to five per card; put additional breadth behind progressive disclosure.
4. Never change a card ID after release. Deprecate or alias it in data migrations.
5. Do not silently convert approximate literal definitions into clinical claims.
6. Keep newly written drama lines original and generic.
7. When content changes could alter answers or mastery, increment `contentVersion` and define a non-destructive migration.
8. Re-run a medical terminology review when adding disease, drug, test, or treatment explanations.

---

## 23. Reference list

- Ahn, S. (2023). [A use case of ChatGPT in a flipped medical terminology course](https://pmc.ncbi.nlm.nih.gov/articles/PMC10493404/).
- Cambra-Badii, I., et al. (2021). [TV medical dramas: health sciences students’ viewing habits and potential for teaching](https://pmc.ncbi.nlm.nih.gov/articles/PMC8474903/).
- Carter, K., Rutherford, M., & Stevens, C. (2024). [*Building a Medical Terminology Foundation 2e*](https://ecampusontario.pressbooks.pub/medicalterminology2/). CC BY 4.0.
- Carter, K., Rutherford, M., & Stevens, C. (2024). [*Building a Medical Terminology Foundation 2e — Student Companion Workbook*](https://ecampusontario.pressbooks.pub/medicalterminology2studentworkbook/). CC BY 4.0.
- Chabner, D.-E. (2026). [*Medical Terminology: A Short Course*, 10th ed.](https://www.us.elsevierhealth.com/medical-terminology-a-short-course-9780443280955.html).
- Ernstmeyer, K., & Christman, E. (eds.). (2024). [*Medical Terminology*, 2nd ed., Chapter 1](https://www.ncbi.nlm.nih.gov/books/NBK607453/). Open RN / Chippewa Valley Technical College. CC BY 4.0.
- McAllister, N., et al. (2022). [Roots, prefixes, and suffixes: decoding medical terminology using word-part instruction](https://www.sciencedirect.com/science/article/pii/S1557308722000051).
- Seidlein, A.-H., et al. (2020). [Gamified e-learning in medical terminology: the TERMInator tool](https://pmc.ncbi.nlm.nih.gov/articles/PMC7456391/).
- Sreeram, A. (2025). [What patients are hearing: a large-scale corpus analysis of the most referenced medical conditions and pharmacologic drugs in popular medical television](https://search.proquest.com/openview/5ffa5bc00f2ff39df360e6032b3f7e68/1.pdf?cbl=7056408&pq-origsite=gscholar).
- Sturdy, L., & Erickson, S. (2022). [*The Language of Medical Terminology*](https://pressbooks.openeducationalberta.ca/medicalterminology/). CC BY-NC-SA 4.0.
- Wulff, H. R. (2004). [The language of medicine](https://pmc.ncbi.nlm.nih.gov/articles/PMC1079361/).

This curriculum’s teaching prose, fictional dialogue, selection, sequence, questions, and feedback are newly written. Linked sources informed the design and terminology checks; the application should inherit the host repository’s established content-license policy rather than introducing a new license declaration without project-owner approval.
