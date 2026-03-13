---
layout: blog
categories:
  - blog
title: The Machines Learned to Speak. And We Forgot How to Listen.
---

## The Machines Learned to Speak. And We Forgot How to Listen.

We trained them to catch the liars.
For decades, we fed them the words of deceit.
The misspelings. The urgency!!! The dollar signs and exclamation marks????
The "CONGRATULATIONS" and "ACT NOW" and "CLICK HERE."

And they learned. They learned so well
that 99.9% of the noise never reached us.

We celebrated. We tuned precision, recall, F1 scores.
We drew decision boundaries and called it security.

And then the liars learned to speak like us, aah jerry where art thou?

## The War We Already Lost

Here's what most spam classifiers do, if you strip away the academic language. They count words. They look at pairs of words. They measure how often "free" appears next to "prize" and how rarely "meeting" appears next to "lunch." They draw a line. One side is spam. The other side ham.

Every feature on the spam side of that line has a texture to it. Broken grammer. Urgency. Greed triggers. Formatting that scrEAMS!

Now hand that attacker an LLM.

The misspellings disappear. The urgency softens into something conversational. The formatting cleans itself up. The text doesn't just dodge the decision boundary. It lives entirely in the region the classifier was taught to trust.

This isn't evasion. This isn't someone tweaking a phishing email to sneak past a filter. This is a class break. The entire feature space the model was trained against? Compromised. Not by a better attack, but by a fundamentally different kind of attacker.

Research already confirms this. A [study evaluating AI-generated phishing emails](https://www.sciencedirect.com/science/article/pii/S0957417425006669#:~:text=By%20systematically%20generating,generated%20phishing%20content.) found that Gmail and Outlook allowed more (96% where's the head blown emoji?) LLM-crafted phishing through their filters than Yahoo (10%) did, exposing real vulnerabilities in the systems we trust most. Separately, [researchers demonstrated](https://www.researchgate.net/publication/393923932_Talking_Like_a_Phisher_LLM-Based_Attacks_on_Voice_Phishing_Classifiers) that LLM-paraphrased vishing scripts evade voice phishing classifiers while preserving every ounce of deceptive intent.

The content layer, the one we spent years perfecting defenses against, is no longer ours. But what is ours? oooh.. don't go there. 

## "But We Have Metadata"

Yeah. I hear you.

Source IP. Sender reputation. SPF, DKIM, DMARC. Sending volume. Time-of-day patterns. Account age. The stuff that lives below the content layer. The stuff the LLM can't rewrite.

And you're right. For now.

But let me tell you about Jia Tan. or maybe let [veritasium](https://youtu.be/aoag03mSuXQ?si=gaming-you-a-lttle-u-snitch)... i lived through it, as an observer scrambling for assessment and response. 

Jia Tan (almost certainly not one person) spent roughly two years contributing to the [XZ Utils project](https://research.swtch.com/xz-timeline). Building commit history. Earning trust. Socially pressuring the maintainer through sock puppet accounts. Playing the longest of long games until they had enough access to plant a backdoor in a compression library that ships with basically every Linux distribution.

[Kaspersky's analysis](https://securelist.com/xz-backdoor-story-part-2-social-engineering/112476/) found that the malicious commits were made completely out of sync with Jia Tan's prior work patterns, suggesting either a second party inserted the code, or the account was operated by a team. Multiple identities (Jigar Kumar, Dennis Ens, Hans Jansen) pressured the original maintainer and downstream distributors at different stages. As [one researcher put it](https://boehs.org/node/everything-i-know-about-the-xz-backdoor): the attacker "meticulously examined the culture of open source and then pounced on its norms, twisting them strategically to their benefit."

This was one operation. One identity (or a handful). One long con. And the bottleneck wasn't the code. It wasn't the technical skill. It was the sustained human effort to maintain a credible presence over time. The emails. The commit messages. The forum interactions. The slow, patient construction of trust.

LLMs collapse that bottleneck to near zero.

One operator could run dozens of synthetic identities in parallel. Each one warming up email domains. Building forum presence. Contributing to open source projects. Writing commit messages that read like a senior developer who cares about code quality. Establishing the kind of reputation that makes metadata-based defenses say "yeah, this one's legit."

The metadata signals we rely on, account age, behavioral consistency, reputation scores, they stop being expensive to fake. They just take patience and parallelism. Both of which got dramaticaly cheaper overnight.

> See many fake instagram accounts? Many fake reddit accounts? aah.. this is AI.. the account was created only yesterday/aah 2026, well the year just started. who are you kidding?

This isn't a better phishing email.
This is the industrialization of the long con.

## The Imperfection Paradox

Here's the part that keeps me up at night. Not really, but i think claude thinks it does... maybe it does and i don't know? who knows at this point... all to say. i get to work on time. so hr, look elsewhere. :)

I've caught myself, and I know I'm not alone, deliberately writing worse. In emails. In commit messages. 

> In Slack (i don't use slack, claude thinkls i do. who am i to argue with it). 

Throwing in typos. Keeping things rough. Because somewhere in the back of my mind I know that perfectly written content raises eyebrows now. -_-

"Did they write this, or did ChatGPT?"

>claude you llmist, you don't think people will ever think or did "claude"? classic leftist behav bro! 

That instinct isn't irrational. AI text detection [literally works](https://humtech.ucla.edu/technology/the-imperfection-of-ai-detection-tools/) by measuring how predictable and uniform writing is. Low perplexity. Low burstiness. That's the AI signature. Human writing is messy and inconsistent and full of personality quirks. And when researchers asked ChatGPT to write like a teenager, Turnitin's detection rate dropped from 100% to 0%.

The imperfections are the signal.

So we've arrived at this place where:

Imperfection signals authenticity. Your typos are proof of humanity.
Perfection signals suspicion. Clean prose gets you flagged.
Attackers weaponize perfection. LLMs produce exactly the text that bypasses content classifiers.
Defenders rely on imperfection. Both in AI detection and in the social trust layer where we unconsciously assess "does this person seem real?"

The entire trust model, for spam filters, for AI detection, for social engineering defense, is built on the assumption that deception leaves artifacts. Spelling mistakes. Broken grammar. Inconsistency over time.

What happens when the deception is artifact-free?

And what happens when the honest people start introducing artifacts on purpose, just to prove they're real?

We're in a world where the liars sound polished
and the truth-tellers are learning to sound rough.

That's not a detection problem. That's a philosophical inversion.

## So What Do We Actually Do About This?

If the content layer is compromised, and the metadata layer can be gamed with patience and parallelism, what's left? or right? or center? what?

The industry is exploring three lanes. None of them are clean answers. All of them are incomplete. But together they start to paint a picture; not me the art, you the artist!

### Lane 1: Content Provenance (Sign Everything)

The [Coalition for Content Provenance and Authenticity (C2PA)](https://c2pa.org/) is building an open standard for cryptographically signing digital content. Think of it as a nutrition label for media: who created it, what tools were used, whether AI was involved. [Google is already integrating it](https://blog.google/innovation-and-ai/products/google-gen-ai-content-transparency-c2pa/) into Search and Ads, so users can see if an image was created or edited with AI tools. Even the [NSA published guidance](https://media.defense.gov/2025/Jan/29/2003634788/-1/-1/0/CSI-CONTENT-CREDENTIALS.PDF) recommending Content Credentials as part of a multi-faceted approach to content trust.

The catch? C2PA proves authenticity when present, but it can't prevent removal. It's opt-in provenance, not enforced identity. An attacker who strips the metadata is back to square one. And AI tools have to *voluntarily* label their output. Good luck with that when the incentive is deception.

This is your GPG intuition, scaled to content. It works for legitimate actors who want to prove they're real. It does nothing against actors who don't want to be traced.

### Lane 2: Proof of Humanity (Prove You're Real)

basically, *do you bleed* kinda scenario.

[World ID](https://world.org/blog/world/proof-of-human-essential-going-mainstream-2025) (Sam Altman's project) and [Humanity Protocol](https://www.humanity.org/) are building biometric identity layers. The idea: use iris scans or palm vein recognition combined with zero-knowledge proofs to verify you're a unique, living human, without revealing who you are. One credential equals one account. Sybil farms get locked out. Could just be a more broken form of aadhar. yail? yht another identity language.

All these years spent to get away from thumb print to a signature, only to be back to a damn thumbprint! what sort of a sick circle are we living through?

The catch? Scale and adoption. 

> If proof of humanity isn't universal, it creates a two-tier internet: verified humans and everyone else. And "everyone else" includes people in regions without access to the biometric hardware, people who don't trust a private company with their iris scan (reasonable), and every anonymous whistleblower and dissident who needs to be heard without being identified.

I don't believe the above narrative, claude does. If a billion people can be fooled into it, we're 1 over 7 done for, remaining 6 will cave. 

This is IDAM at human scale. And like all IDAM, the question isn't whether the protocol is sound. The question is who controls the identity provider. and I know no one has this problem solved.

### Lane 3: Agentic Identity (Know Your Agent)

The newest lane. As AI agents start acting on behalf of humans, booking flights, sending emails, making purchases, companies like [Prove](https://www.prove.com/) are building "Know Your Agent" frameworks that cryptographically link every agent action back to a verified human. [Humanity Protocol is evolving](https://mpost.io/humanity-unveils-proof-of-trust-framework-to-establish-new-standard-for-digital-verification/) from "Proof of Humanity" to "Proof of Trust," enabling verifiable credentials tied to specific identity traits (age, residency, employment) without exposing underlying personal data.

The catch? This assumes a clean delegation chain. Human verifies identity, human authorizes agent, agent acts within scope. But what about agents that spawn other agents? or agent delegating physcial work to humans? 

You tell me, would you refuse 3 eth, just to verify a link to say yes you're human? add a war torn locality around you, and i'm sure you'll be desperate enough. 

What about the Jia Tan scenario, where the "human" at the top of the chain is itself a long-running synthetic persona that passed the biometric check two years ago?

We're building identity infrastructure for a world where identity itself is the attack surface.

## The Uncomfortable Truth

None of these lanes solve the problem alone.

Content provenance helps honest actors. Proof of humanity helps at the enrollment boundary. Agentic identity helps in the delegation chain. But a motivated attacker who enrolls a real human identity, builds reputation over months, and uses LLMs to maintain dozens of personas at scale? They're inside all three perimeters before the first alarm fires.

The next war isn't about better classifiers or smarter filters.
It's about synthetic identity at scale.
And I don't think most defenders have fully internalized that yet.

## The Ones Already Living in the Margins

Here's the part nobody talks about.

Some of us already live like the threat model.

Not because we're attackers. Because we've been paying attention.

And sometimes you come out of that cocoon. You write something like this. You put your name on it. And then you retreat again.

We're not bots. We're not bad actors. We're the people who understood the game early enough to play defense. We fragment our identities not to deceive, but to survive in an ecosystem that was never designed to protect us.

And here's the problem: we look exactly like the attackers.

a Sybil farm?
email aliases? That's operational infrastructure.
Multiple personas? That's astroturfing.

Every identity-based defense being built right now, C2PA, proof of humanity, Know Your Agent, they all share the same assumption: that legitimate humans operate as one identity, and only bad actors fragment. But that's not true. It hasn't been true for years.

The privacy-conscious and the malicious are now indistinguishable by behavior. The person running seven accounts for self-preservation and the person running seven accounts for social engineering leave the same footprint. And any system that tries to collapse everyone into "one human, one identity" doesn't just catch the attackers. It catches the people who were trying to protect themselves from the attackers in the first place.

The defenders and the threats
are wearing the same mask.
Not because they chose the same costume,
but because the world gave them the same reasons to hide.

If your identity framework can't tell the difference between a privacy-conscious human and a synthetic persona, it's not solving the problem. It's just making the perimeter smaller and leaving more people outside of it.

## So Where Does That Leave Us?

I don't have a clean answer. Nobody does. If someone tells you they do, they're selling something, probably with a blockchain attached.

But I know what the answer isn't.

It isn't "better classifiers." The content war is over.
It isn't "one identity per human." That's a surveilance architecture dressed in safety language.
It isn't "just trust the metadata." Patience and parallelism broke that too.

Maybe the answer is layers. Provenance for content. Proof of humanity at critical trust boundaries. Behavioral anomaly detection for long-running reputation attacks. And the humility to admit that no single system will hold.

Maybe it's something we haven't built yet. Something that accounts for the fact that the most security-aware humans on the planet already behave like the threat model predicts only attackers would.

If your security model assumes that "real people write like humans and bots write like bots," you're already behind.

The bots write like humans now.
And some of us are writing like bots just to seem real.

We trained the machines to catch the liars.
And somewhere along the way,
the machines learned to lie better than we ever could.

---

*This blog was co-written with Claude. The ideas, the paranoia, and the typos are mine. The structure and some of the prose came from a conversation with an LLM. Which, if you've read this far, is exactly the kind of irony you should be uncomfortable with.*


---

### References & Further Reading

- [Evaluating spam filters and Stylometric Detection of AI-generated phishing emails](https://www.sciencedirect.com/science/article/pii/S0957417425006669) (ScienceDirect, 2025)
- [Talking Like a Phisher: LLM-Based Attacks on Voice Phishing Classifiers](https://www.researchgate.net/publication/393923932_Talking_Like_a_Phisher_LLM-Based_Attacks_on_Voice_Phishing_Classifiers) (ICDF2C 2025)
- [An Investigation of Large Language Models and Their Vulnerabilities in Spam Detection](https://arxiv.org/abs/2504.09776) (arXiv, 2025)
- [Detecting LLM-Generated Spam Reviews: FraudSquad](https://arxiv.org/abs/2510.01801) (arXiv, 2025)
- [The Imperfection of AI Detection Tools](https://humtech.ucla.edu/technology/the-imperfection-of-ai-detection-tools/) (UCLA HumTech, 2025)
- [Timeline of the XZ open source attack](https://research.swtch.com/xz-timeline) (Russ Cox)
- [Social engineering aspect of the XZ incident](https://securelist.com/xz-backdoor-story-part-2-social-engineering/112476/) (Kaspersky/Securelist)
- [Everything I Know About the XZ Backdoor](https://boehs.org/node/everything-i-know-about-the-xz-backdoor) (Evan Boehs)
- [Behind Enemy Lines: Understanding the XZ Backdoor](https://www.offsec.com/blog/xz-backdoor/) (OffSec)
- [XZ Utils Backdoor: Wikipedia](https://en.wikipedia.org/wiki/XZ_Utils_backdoor)
- [C2PA: Content Provenance & Authenticity Standard](https://c2pa.org/)
- [NSA: Strengthening Multimedia Integrity in the Generative AI Era](https://media.defense.gov/2025/Jan/29/2003634788/-1/-1/0/CSI-CONTENT-CREDENTIALS.PDF) (January 2025)
- [Google and the C2PA: Increasing Transparency for Gen AI Content](https://blog.google/innovation-and-ai/products/google-gen-ai-content-transparency-c2pa/) (January 2026)
- [World ID: Proof of Human Going Mainstream in 2025](https://world.org/blog/world/proof-of-human-essential-going-mainstream-2025)
- [Humanity Protocol: Digital Identity Verification](https://www.humanity.org/use-cases/digital-identity-verification-combat-ai-threat)
- [Humanity Unveils Proof-of-Trust Framework](https://mpost.io/humanity-unveils-proof-of-trust-framework-to-establish-new-standard-for-digital-verification/) (February 2026)
- [The Future of Digital Identity: Prove / Improve 2025](https://www.prove.com/blog/future-of-digital-identity-improve-2025)
- [Veritasium](https://youtu.be/Aq5WXmQQooo?si=ricking-your-roll)

Also what is this `si` values in youtube share videos? try skipping that next time, game the system. some already do. 
