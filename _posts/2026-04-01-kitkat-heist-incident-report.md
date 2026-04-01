---
layout: post-terminal
title: "INCIDENT REPORT: KitKat Supply Chain Compromise"
category: security
subcategory: appsec
spanning:
  - reflection
---

On March 29, 2026, Nestlé publicly disclosed the exfiltration of 12 metric tons of KitKat product from an in-transit supply chain. Within 48 hours, over 119 organizations issued official statements. Not one contained actionable intelligence. Most offered condolences. Several announced new KitKat-flavored menu items. [One deployed a bidet](https://www.instagram.com/p/DWjiun5jf1K). In the absence of competent incident response from any of the 119[^1] responding parties, this independent investigation was initiated.

## INITIAL ALERT

```shell
$ tail -1 /var/log/supply_chain.log
Mar 26 00:00:00 CRIT: 413793 units KitKat exfiltrated. vector=physical(truck). CVE=NONE. iocs=NONE. mfa=disabled.
```

## EXECUTIVE SUMMARY

```syslog
Apr  1 09:00:00 SEVERITY: CRITICAL
Apr  1 09:00:00 INCIDENT ID: IR-2026-0401-CHOC
Apr  1 09:00:00 CLASSIFICATION: Supply Chain Compromise
Apr  1 09:00:00 STATUS: CLOSED. 
```

- 413,793 units of KitKat (12 metric tons) exfiltrated in transit.
- Route: Factory (Central Italy) → Poland.
- Product: Limited edition F1 bolide-shaped bars.
- Attack vector: Physical access (truck).
- Threat actor: Unattributed. Tentatively tracked as `APT-CHOC`.

## INCIDENT TIMELINE

```
Mar 26 00:00:00 Initial compromise. No alerts triggered.
Mar 29 14:32:00 Public disclosure by vendor (Nestlé).
Mar 31 11:47:00 Vendor claims cargo recovered. No forensic evidence provided.
```

- IOCs: None.
- CVE: None assigned.
- MITRE ATT&CK:
    - T1195.002 (Supply Chain Compromise: Compromise Software Supply Chain)...okay, T1195 doesn't really cover chocolate.
    - Closest match: T1565.001 (Data Manipulation: Stored Data Manipulation)...that's not right either.

Fine. There is no MITRE technique for stealing a truck full of chocolate.

## DETECTION GAP

Existing SIEM rules did not account for physical exfiltration of confectionery.

Sigma rule `kitkat_exfiltration.yml` has been drafted (see below). No EDR telemetry available. The truck did not have an agent installed.

## PROPOSED DETECTION RULE

```yaml
title: KitKat Exfiltration via Physical Access Vector
status: experimental
logsource:
    category: logistics
    product: chocolate
detection:
    selection:
        cargo.type: "confectionery"
        cargo.weight|gte: 10000kg
        destination.reached: false
        driver.mfa_enabled: false
    condition: selection
falsepositives:
    - Legitimate break (the good kind)
    - Easter demand surge misclassified as exfiltration
    - Truck driver took the slogan literally
level: critical
```

## LESSONS LEARNED

1. Implement MFA on all cargo vehicles.
2. Deploy EDR agents on trucks. Yes, trucks.
3. The phrase "have a break" should not be interpreted as operational guidance.
4. 140+ brands issued "official statements" within 48 hours.
   Largest uncoordinated incident response in social media history.
   None of them helped recover the chocolate.

## RECOMMENDATION

Close incident. Update runbook. File under "SEP (Someone Else's Problem)."

---

*No KitKats were consumed during the writing of this report. Remaining inventory has been verified. For Legal purposes: April Fools?* 


[^1]: Exhibit A: [view condolences (119 brands)](/evidence/kitkat-condolences/)

