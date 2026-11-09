// Prototype-only employee data. Keys match the approved ESS field matrix.
// Null and blank values deliberately exercise the field-level empty treatment.
// All displayed Effective date fields use the approved 03/05/2018 demo fixture.
window.profileMockFixtures={
  'thong-tin-co-ban':{
    'Full Name':'Nguyễn Quang','EmpDisplayName':'QuangNQ','Date of Birth':'15/08/1992','Gender':'Nam','Nationality':'Việt Nam','Marrital Status':'Đã kết hôn',
    'Age':'34','Country of Birth':'Việt Nam','City/Province of Birth':'Hà Nội','Birth Location':'Hà Nội','Highest Educational Level':'Đại học','Social Name':null,'Effective Date':'03/05/2018'
  },
  'thong-tin-cong-viec':{
    'Company':'FPT Software JSC','Department':'AI Center','Job':'AI Engineer 1','Emp Level':'Level 3','Group First Start Date':'02/05/2018','Group Seniority':'6 năm 4 tháng',
    'Effective Date':'03/05/2018','Contract Type':'Hợp đồng không xác định thời hạn','Business Unit':'AI Center','Location':'Hà Nội','Full/Part':'Toàn thời gian','Supervisor':null
  },
  'trinh-do-hoc-van':{'Educational est.':'Đại học','School':'Đại học Bách khoa Hà Nội','Major':'Công nghệ thông tin','Branch of study 1':'Kỹ thuật phần mềm','Degree':'Cử nhân','End date':'30/06/2017','Start Date':'01/09/2013','Country':'Việt Nam','City/Province':'Hà Nội','GPA':null},
  'chung-chi':{'Name':'AWS Certified Cloud Practitioner','Type':'Chứng chỉ chuyên môn','Specialize':'Cloud Computing','Level':'Foundation','Issued by':'Amazon Web Services','End date':'30/06/2028','Issued date':'30/06/2025','Number':null},
  'khen-thuong':{'Rewards Category':'Khen thưởng cá nhân','Rewards Title':'Nhân viên xuất sắc','Organize Rewards':'FPT Software JSC','Decision By':'Giám đốc đơn vị','Decision number':'QĐ-KT-2026-015','Decision date':'15/01/2026','Effective Date':'03/05/2018','Reward Content':null},
  'ky-luat':{'Type':'Kỷ luật nội bộ','Form of Discipline':'Khiển trách','Start date':'01/03/2025','End date':'31/05/2025','Decision number':'QĐ-KL-2025-004','Decision date':'28/02/2025','Decision by':'Giám đốc đơn vị','Discipline content':null},
  'tai-khoan-ngan-hang':{'Bank Name':'Techcombank','Bank Account':'1903••••5678','Payee':'Nguyễn Quang','Bank Country':'Việt Nam','Payment currency':'VND','Effective Date':'03/05/2018'},
  'thong-tin-dinh-danh':{'National ID Type':'Căn cước công dân','National ID':'079•••••456','Issue Date':'12/04/2021','End Date':'15/08/2032','Issue By':'Cục Cảnh sát QLHC về TTXH','Country':'Việt Nam','Priority':null},
  'ma-so-thue':{'Number':'010••••789','Country':'Việt Nam','Issue Date':'10/06/2018','Issue By':'Chi cục Thuế Cầu Giấy'},
  'lien-lac':{'Phone Number':'090••••789','Phone Type':'Di động','Primary Contact':'Có','Email Address':'quang.nguyen@fpt.com','Email Type':'Email công việc','Phone Effective Date':'03/05/2018','Email Effective Date':'03/05/2018'},
  'dia-chi':{'Country':'Việt Nam','City':'TP. Hồ Chí Minh','District':'TP. Thủ Đức','Ward':'Phường Thảo Điền','Address':'123 Đường số 1, Thảo Điền','Effective Date':'03/05/2018'},
  'kinh-nghiem-lam-viec':{'Employer':'FPT Software JSC','Job':'AI Engineer','Department':'AI Center','Industry':'Công nghệ thông tin','Start date':'02/05/2018','End date':'Hiện tại','Country':'Việt Nam','Location':'Hà Nội','Reason leave':null},
  'to-chuc-xa-hoi':{'Type':'Công đoàn','Name':'Công đoàn FPT Software','Position in the Organization':'Đoàn viên','Start Date':'01/01/2020','End Date':'31/12/2026','Card Number':'CD-2020-00158','Location':'Hà Nội','Note':null},
  'nguoi-than':{'Full Name':'Nguyễn Minh Anh','Relationship':'Vợ','Date of Birth':'20/10/1993','Gender':'Nữ','Is dependent?':'Có','Phone Number':'091••••123','Nationality':'Việt Nam','Is emergency':'Có','Tax code':null,'Start Date':'03/05/2018'},
  'lien-he-khan-cap':{'Full name':'Nguyễn Minh Anh','Relationship':'Vợ','Mobile phone':'091••••123','Email':'minh.anh@example.com','Main Address':'Hà Nội','Nationality':'Việt Nam','Secondary address':null,'Effective Date':'03/05/2018'},
  'thong-tin-khac':{'Family Background':'Công nhân viên chức','Beneficiary Of Social Welfare':'Không'}
};

// Prototype-only record versions, including older display-name/address
// values to distinguish snapshots. The baseline predates ESS requests and has
// no approval events. Every later committed version owns one approval cycle.
function mockProfileRecord(block,id,effectiveDate,createdOn,request=null,current=false,olderValues={}){
  return {
    id,current,committed:true,
    values:{...window.profileMockFixtures[block],...olderValues,'Effective Date':effectiveDate},
    audit:{createdBy:'Nguyễn Quang',createdOn,lastModifiedBy:'Nguyễn Quang',lastModifiedOn:createdOn},
    workflow:request?[
      {code:'INITIATE',date:request.sent,participant:'Nguyễn Quang',comment:null},
      {code:'APPROVE',date:request.approved,participant:'Trần Minh Anh',comment:null}
    ]:[]
  };
}
window.profileRecordFixtures={
  'thong-tin-co-ban':[
    mockProfileRecord('thong-tin-co-ban','baseline','02/05/2018','02/05/2018 08:00',null,false,
      {EmpDisplayName:'Nguyễn Quang'}),
    mockProfileRecord('thong-tin-co-ban','approved-1','03/05/2018','03/05/2018 10:35',
      {sent:'03/05/2018 09:00',approved:'03/05/2018 10:30'},true)
  ],
  'dia-chi':[
    mockProfileRecord('dia-chi','baseline','01/05/2018','01/05/2018 08:00',null,false,
      {Address:'101 Đường số 1, Thảo Điền'}),
    mockProfileRecord('dia-chi','approved-1','02/05/2018','02/05/2018 10:45',
      {sent:'02/05/2018 09:10',approved:'02/05/2018 10:40'},false,
      {Address:'115 Đường số 1, Thảo Điền'}),
    mockProfileRecord('dia-chi','approved-2','03/05/2018','03/05/2018 10:45',
      {sent:'03/05/2018 09:10',approved:'03/05/2018 10:40'},true)
  ],
  'lien-he-khan-cap':[
    mockProfileRecord('lien-he-khan-cap','baseline','03/05/2018','03/05/2018 09:20',null,true)
  ]
};
// Request lifecycle scenarios explicitly requested by the 01 Oct 2026 Working specification.
window.profileRecordFixtures['thong-tin-co-ban'].push({
 id:'pending-basic-2026',provisional:true,committed:false,approved:false,requestStatus:'Waiting Approval',effectiveDate:'15/10/2026',
 values:{...window.profileMockFixtures['thong-tin-co-ban'],'Effective Date':'15/10/2026',EmpDisplayName:'QuangNQ2','Birth Location':'Ninh Bình'},
 audit:{createdBy:'Nguyễn Quang',createdOn:'01/10/2026 16:00'},workflow:[{code:'INITIATE',date:'01/10/2026 16:00',participant:'Nguyễn Quang',comment:null}]
});
window.profileRecordFixtures['thong-tin-dinh-danh']=[
 mockProfileRecord('thong-tin-dinh-danh','national-current','12/06/2020','12/06/2020 09:00',null,true),
 {...mockProfileRecord('thong-tin-dinh-danh','national-scheduled','01/01/2027','30/09/2026 10:00',{sent:'30/09/2026 09:00',approved:'30/09/2026 09:45'},false,
 {'National ID':'001099999999','Issue Date':'15/09/2026','End Date':'15/09/2036','Issue By':'Hà Nội'}),approved:true,effectiveDate:'01/01/2027'}
];

// Independent demo entities, not historical versions of the same entity.
// The header uses exactly one configured source field for every record.
window.profileCollectionConfig={
 'nguoi-than':{identityField:'Full Name'},
 'thong-tin-dinh-danh':{identityField:'National ID Type'},
 'chung-chi':{identityField:'Name'}
};
const collectionEntity=(block,id,values)=>({id:'baseline-'+id,entityId:id,current:true,committed:true,values:{...window.profileMockFixtures[block],...values}});
window.profileCollectionFixtures={
 'nguoi-than':[
  collectionEntity('nguoi-than','family-spouse',{}),
  collectionEntity('nguoi-than','family-child',{'Full Name':'Nguyễn Minh Khang',Relationship:'Con','Date of Birth':'15/03/2020',Gender:'Nam','Is dependent?':'Có','Is emergency':'Không','Phone Number':null,'Start Date':'01/01/2026'}),
  collectionEntity('nguoi-than','family-parent',{'Full Name':'Nguyễn Văn Minh',Relationship:'Cha','Date of Birth':'10/05/1965',Gender:'Nam','Is dependent?':'Không','Is emergency':'Không','Phone Number':null,'Start Date':'01/01/2026'})
 ],
 'thong-tin-dinh-danh':[
  collectionEntity('thong-tin-dinh-danh','national-citizen',{Priority:'Có'}),
  collectionEntity('thong-tin-dinh-danh','national-passport',{'National ID Type':'Hộ chiếu','National ID':'B••••123','Issue Date':'15/03/2023','End Date':'15/03/2033','Issue By':'Cục Quản lý xuất nhập cảnh',Priority:'Có'})
 ],
 'chung-chi':[
  collectionEntity('chung-chi','certificate-aws',{}),
  collectionEntity('chung-chi','certificate-azure',{Name:'Azure Fundamentals',Type:'Cloud',Specialize:'Cloud Computing',Level:'Foundation','Issued by':'Microsoft','Issued date':'15/04/2025','End date':null,Number:null}),
  collectionEntity('chung-chi','certificate-security',{Name:'CompTIA Security+',Type:'Security',Specialize:'Information Security',Level:'Professional','Issued by':'CompTIA','Issued date':'20/08/2025','End date':'20/08/2028',Number:null})
 ]
};
