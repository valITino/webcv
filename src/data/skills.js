// Skill ratings transcribed exactly from the résumé star scale (out of 5).
// Note: "Sarkasm" carries a 6th, off-the-scale red star — the subject's own easter egg.
export const techSkills = [
  { group: 'Scripting', items: [['Python', 4], ['Bash', 3], ['Powershell', 3], ['JavaScript', 2]] },
  { group: 'Networking', items: [['OSI Model', 4], ['TCP/IP', 4], ['DNS', 3], ['Tor', 3], ['Proxies', 3]] },
  { group: 'IT Practices', items: [['Kanban', 4]] },
  { group: 'Management', items: [['JIRA', 4], ['Confluence', 5]] },
  { group: 'EDR / XDR', items: [['MS XDR', 4], ['Trellix', 2], ['Crowdstrike', 3]] },
  { group: 'SIEM & IRP', items: [['Splunk', 4], ['Elastic', 4], ['MS Sentinel', 3], ['QRadar', 2], ['TheHive', 3]] },
  { group: 'DBMS', items: [['SQLite', 2], ['Redis', 2], ['Postgres', 3], ['MSSQL', 3]] },
  {
    group: 'Blue & Red Hat',
    items: [
      ['Wireshark', 4], ['Exeon', 3], ['JOESandbox', 4], ['Nmap', 3],
      ['Velociraptor', 3], ['BurpSuite', 2], ['Metasploit', 2], ['OSINT', 4],
    ],
  },
]

export const softSkills = [
  {
    group: 'Consulting',
    items: [['Presentation', 3], ['Leadership', 4], ['Prioritization', 4], ['Reporting', 3], ['Strategical', 4]],
  },
  {
    group: 'Personality',
    items: [
      ['Discipline', 5], ['Respect', 5], ['Resilience', 4], ['Preciseness', 4],
      ['Passion', 5], ['Humor', 5], ['Sarkasm', 6],
    ],
  },
]
