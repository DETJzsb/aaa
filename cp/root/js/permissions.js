export const LEVEL={
  root:6,directeur:5,sous_directeur:4,
  supervisor:3,team_leader:2,agent:1
}

export const canEdit=(me,target)=>LEVEL[me]>LEVEL[target]
