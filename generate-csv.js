(async()=>{
const generateCSV = async(date, nextDate)=>{
  let rep = await fetch('http://localhost:48080/command/ex',{method:"POST",body:`select * from report_req where reportTime > '${date}' and reportTime < '${nextDate}' and countsjson like '{"3%';`});
  let json = await rep.json();
  if(0 == json.length){return;}

  let arr = ['"Using Time","Report Time","Handshake","Client Uuid","SDK Version","PDF417 Used","Browser","Browser Version","OS"'];
  for(let i of json){
    let os = JSON.parse(i.os);
    arr.push(`"${i.usingtime}","${i.reporttime}","${i.handshake}","${i.clientuuid}","${i.version}",${JSON.parse(i.countsjson)["3"]},"${os.browser}","${os.version}","${os.OS}"`);
  }

  const blobUrl = URL.createObjectURL(new Blob([arr.join('\n')], {type: "text/plain"}));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = 'u11589-'+date+'.csv';
  document.body.appendChild(link);
  link.dispatchEvent(
    new MouseEvent('click', { 
      bubbles: true, 
      cancelable: true, 
      view: window 
    })
  );
  document.body.removeChild(link);
  await new Promise(r=>setTimeout(r,100));
  URL.revokeObjectURL(blobUrl);
}
for(let day = 8; day < 31; ++day){
  let date = '2024-12-'+(day<10?'0':'')+day;
  let nextDate = 31==day?'2025-01-01':('2024-12-'+(day+1<10?'0':'')+(day+1));
  await generateCSV(date, nextDate);
}
for(let day = 1; day < 14; ++day){
  let date = '2025-01-'+(day<10?'0':'')+day;
  let nextDate = '2025-01-'+(day+1<10?'0':'')+(day+1);
  await generateCSV(date, nextDate);
}
})()