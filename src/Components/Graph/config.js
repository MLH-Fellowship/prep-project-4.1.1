
export const getGraphOptions = (type)=>{
    if(type=='Bar'){

        return {
            title:{
            display:true,
            text:'Average Rainfall per month',
            fontSize:20
            },
            legend:{
            display:true,
            position:'right'
            },
            maintainAspectRatio: false
          };

    }else if(type == 'Pie'){
        return {
            title:{
              display:true,
              text:'Average Rainfall per month',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            },
            maintainAspectRatio: false
          }
    }else if(type == 'Line'){
        return {
            title:{
              display:true,
              text:'Average Rainfall per month',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            },
            maintainAspectRatio: false
          }
    }
}