const state={data:null};
const loadData=async()=>{
    $('#status').text('加载中...').show();
    try{
        const response = await fetch('schools.json');
        if(!response.ok){
            throw new Error('HTTP'+response.status);
        }
        const data=await response.json();
        if(data.rooms.length===0){
            $('#status').text('暂无数据').show();
            return;
        }
        state.data=data;
        $('#sub-title').text(data.title+'.数据来源:校园自习室')
        $('#status').hide();
        renderCards(data);
        renderPieChart(data);
    }catch(error){
        $('#status').text("加载失败"+error.message).show();
    }
};
const renderCards = (data) => {
  data.rooms.forEach(room => {
    $('#cards').append(`
      <div class="col-md-4 col-lg-3">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title h6">${room.name}</h3>
            <p class="card-text fs-4">${room.seats}</p>
            <p class="card-text small text-muted">座位数 · 已占用 ${room.occupied}</p>
          </div>
        </div>
      </div>
    `);
  });
};
loadData();
let pieChart =null;
const renderPieChart=(data)=>{
    if(pieChart===null){
        pieChart=echarts.init(document.querySelector('#pie-chart'));
    }
    pieChart.setOption({
        title:{text:'各自习室座位情况',left:'center'},
        tooltip:{
            trigger:'item',
            formatter:(p)=>`${p.name}<br/>总座位：${p.value} 个（占全部 ${p.percent}%）<br/>已占用：${p.data.occupied} 个`
        },
        legend:{type:'scroll',bottom:0,left:'center',width:'90%'},
        series:[{
            name:'座位数',
            type:'pie',
            radius:['35%','60%'],
            center:['50%','48%'],
            avoidLabelOverlap:true,
            itemStyle:{borderRadius:6,borderColor:'#fff',borderWidth:2},
            label:{formatter:'{d}%'},
            emphasis:{
                label:{show:true,fontSize:16,fontWeight:'bold'}
            },
            data:data.rooms.map(room=>({
                name:room.name,
                value:room.seats,
                occupied:room.occupied
            }))
        }]
    });
};

window.addEventListener('resize',()=>{
    if(pieChart)pieChart.resize();
});