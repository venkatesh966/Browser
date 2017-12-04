var fs = require('fs');
var express = require('express');
var app = express();
var randomization = require('shuffle-array');
var math=require('math');
var wri= fs.createWriteStream("out.txt");
const readline = require('readline');
const bodyparser=require('body-parser');
app.use(bodyparser());

app.use(function (req, res, next) {
    let logfile = fs.createWriteStream("logfile.txt", { 'flags': 'a' });//Middleware function
    logfile.write("browser access" + new Date() + "\n");//creating logfile
    logfile.end();
    next();
})

app.get('/',function(req,res)
{
    res.sendFile('login.html',{root: './'});
    res.end('hi');
});
app.post('/', (req,res) => {

    let filepath=req.body.Path;//taking data from browser
    let size=req.body.Size;//taking size of each team from browser
    var teamdata1=[];//array fro storing data
    fs.readFile(filepath, function (err,data) {
             
             var parsed = JSON.parse(data);
             for(var x in parsed.members){
             teamdata1.push(parsed.members[x]);
            }
            console.log(teamdata1);
            randomization(teamdata1);//randomizing the values of teamdata
            console.log(teamdata1);
            
            
                if(size>teamdata1.length)
                {
                  console.log('team size exceeded');
                }
              
                else
                {
                  if(teamdata1.length%size==0)
                  {
                      console.log("teams can be divided into equal parts");
                  }
                  else{
                      console.log("teams cant be divided into equal parts but we can divide into un equal parts");
                  }
                }
                var noteams=math.floor(teamdata1.length/size);
                var lsize=math.floor(size/1);//for operations on variable n storing into other variable
                console.log(lsize);
                console.log(noteams);
                var teamnumber=1;
                for(var i=0;i<noteams;i++)
                {
                    wri.write("\n\n");
                    wri.write("team"+teamnumber+":"+"\n\n");//this line  is for writing to the file
                    teamnumber++;
                    var k=math.floor(i*lsize);
                    var m=math.floor(lsize+i*lsize);//for reducing time for program calculating outside of loop
                    for(var j=k; j< m; j++)
                    {
                        wri.write(JSON.stringify(teamdata1[j])+"\n");//this line  is for writing to the file
                    }      
                }
                if ( teamdata1.length%lsize!=0)
                {
                wri.write("\n\n");//this line  is for writing to the file
                wri.write("team"+teamnumber+":"+"\n\n");
                }
                
                for(;j<teamdata1.length;j++)
                {
                    wri.write(JSON.stringify(teamdata1[j])+"\n");//this line  is for writing to the file
                    //converting into string format
                }
                var readStream = fs.createReadStream("out.txt");
                readStream.pipe(res);//piping the data to the browser
                
    });
    res.write(filepath);
    res.write(size);
    
});
app.listen(7000);
