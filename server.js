const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const csvFilePath = 'person.csv';
const csvFilePath2 = 'household.csv';
const csvFilePath3 = 'event.csv';
const csvFilePath4 = 'special.csv';

app.use(express.json());
app.use(express.static('.')); // 服務靜態文件，如HTML和JavaScript

// 在應用程序啟動時讀取 CSV 文件以獲取最後一行的索引值
fs.readFile('household.csv', 'utf-8', (err, data) => {
    if (!err) {
        const lines = data.trim().split('\n');
        if (lines.length > 1) {
            const lastLine = lines[lines.length - 1];
            const lastLineParts = lastLine.split(',');
            if (lastLineParts.length > 0) {
                index = parseInt(lastLineParts[lastLineParts.length - 1]) + 1;
            }
        }
    }
});

// 處理POST請求，產生CSV文件
app.post('/generate-householdForm-csv', (req, res) => {
    // 從請求體中取得傳遞的數字
    const id = req.body.id;
    const slash = req.body.slash;
    const type = req.body.type;

    const rg = req.body.rg;
    const rg_ch= req.body.rg_ch;
    const first = req.body.first;
    const first_ch = req.body.first_ch;
    const first_all_ch = req.body.first_all_ch;
    
    const second = req.body.second;
    const second_ch = req.body.second_ch;
    const second_all_ch = req.body.second_all_ch;

    const third = req.body.third;
    const third_ch = req.body.third_ch;
    const third_all_ch = req.body.third_all_ch;
    
    const fourth = req.body.fourth;
    const fourth_ch = req.body.fourth_ch;
    const fourth_all_ch = req.body.fourth_all_ch;

    const chome = req.body.chome;
    const address = req.body.address;
    const of1 = req.body.of1;
    const of2 = req.body.of2;

    const revise=req.body.revise;
    const origin_address = req.body.origin_address;
    const o_add_no_checkboxValue = req.body.o_add_no_checkboxValue;

    const clan_name = req.body.clan_name;
    const c_name_no_checkboxValue = req.body.c_name_no_checkboxValue;

    const rg2 = req.body.rg2;
    const rg2_ch = req.body.rg2_ch;
    const yy2 = req.body.yy2;
    const mm2 = req.body.mm2;
    const dd2 = req.body.dd2;
    const reason = req.body.reason;
    const reason_ch = req.body.reason_ch;
    const ex_reason = req.body.ex_reason;
    const ex_reason_ch = req.body.ex_reason_ch;

    const o_name = req.body.o_name;
    const o_yy2 = req.body.o_yy2;
    const o_mm2 = req.body.o_mm2;
    const o_dd2 = req.body.o_dd2;

    const ex_name = req.body.ex_name;
    const ex_relationship = req.body.ex_relationship;
    const ex_relationship_ch = req.body.ex_relationship_ch;
    const job3 = req.body.job3;
    const job3_ch = req.body.job3_ch;


    // 檢查文件是否存在
    fs.access(csvFilePath2, fs.constants.F_OK, (err) => {
        if (err) {
            // 如果文件不存在，寫入標題並附加數據
            const csvHeader = '戶號HID,是否有斜線,戶冊別,rg,年號,adrlevel1,adr1tp,adr1cd,地名1,adrlevel2,adr1tp2,adr1cd2,地名2,adrlevel3,adr1tp3,adr1cd3,地名3,adrlevel4,adr1tp4,adr1cd4,地名4,chome,address,of1,of2,是否有修改,本居又ハ本國住所,本居無此欄位,族稱,族稱無此欄位,開戶年號代碼,開戶年號,開戶年,開戶月,開戶日,開戶緣由代碼,開戶緣由,前戶主退由代碼,前戶主退由,戶主姓名,戶主出生年,戶主出生月,戶主出生日,前戶主姓名,與前戶主續柄代碼,與前戶主續柄,戶主職業代碼,戶主職業,index\n'; 
            fs.writeFile(csvFilePath2, csvHeader, 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing CSV header:', err);
                    res.status(500).send({ message: 'Error in generating CSV' });
                    return;
                }
                appendDataToCSV2(id,slash,type,rg,rg_ch,first,first_ch,first_all_ch,first_all_ch,second,second_ch,second_all_ch,second_all_ch,third,third_ch,third_all_ch,third_all_ch,fourth,fourth_ch,fourth_all_ch,fourth_all_ch,chome,address,of1,of2,revise,origin_address,o_add_no_checkboxValue,clan_name,c_name_no_checkboxValue,rg2,rg2_ch,yy2,mm2,dd2,reason,reason_ch,ex_reason,ex_reason_ch,o_name,o_yy2,o_mm2,o_dd2,ex_name,ex_relationship,ex_relationship_ch,job3,job3_ch,res);
            });
        } else {
            // 文件存在，附加數據
            fs.readFile(csvFilePath2, 'utf-8', (err, data) => {
                if (err) {
                    console.error('Error reading CSV:', err);
                    res.status(500).send({ message: 'Error in generating CSV' });
                    return;
                }
                appendDataToCSV2(id,slash,type,rg,rg_ch,first,first_ch,first_all_ch,first_all_ch,second,second_ch,second_all_ch,second_all_ch,third,third_ch,third_all_ch,third_all_ch,fourth,fourth_ch,fourth_all_ch,fourth_all_ch,chome,address,of1,of2,revise,origin_address,o_add_no_checkboxValue,clan_name,c_name_no_checkboxValue,rg2,rg2_ch,yy2,mm2,dd2,reason,reason_ch,ex_reason,ex_reason_ch,o_name,o_yy2,o_mm2,o_dd2,ex_name,ex_relationship,ex_relationship_ch,job3,job3_ch,res);
            });
        }
    });
});

let index = 1; // 定義一個全局變量，用於自動增加索引值

function appendDataToCSV2(id,slash,type,rg,rg_ch,first,first_ch,first_all_ch,first_all_ch,second,second_ch,second_all_ch,second_all_ch,third,third_ch,third_all_ch,third_all_ch,fourth,fourth_ch,fourth_all_ch,fourth_all_ch,chome,address,of1,of2,revise,origin_address,o_add_no_checkboxValue,clan_name,c_name_no_checkboxValue,rg2,rg2_ch,yy2,mm2,dd2,reason,reason_ch,ex_reason,ex_reason_ch,o_name,o_yy2,o_mm2,o_dd2,ex_name,ex_relationship,ex_relationship_ch,job3,job3_ch,res) {
    // 下拉選單中文
    const rg_ch2 = rg_ch.trim() ? rg_ch.split(' ')[1] : '';//rg_ch 是空白的情況下，rg_ch2 也是空白
    const first_ch2 = first_ch.trim() ?first_ch.split(' ')[1]: '';
    const first_all_ch1 = first_all_ch.trim() ?first_all_ch.split(' ')[0]: '';
    const first_all_ch2 = first_all_ch.trim() ?first_all_ch.split(' ')[1]: '';
    const second_ch2 = second_ch.trim() ?second_ch.split(' ')[1]: '';
    const second_all_ch1 = second_all_ch.trim() ?second_all_ch.split(' ')[0]: '';
    const second_all_ch2 = second_all_ch.trim() ?second_all_ch.split(' ')[1]: '';
    const third_ch2 = third_ch.trim() ? third_ch.split(' ')[1] : '';
    const third_all_ch1 = third_all_ch.trim() ?third_all_ch.split(' ')[0]: '';
    const third_all_ch2 = third_all_ch.trim() ?third_all_ch.split(' ')[1]: '';
    const fourth_ch2 = fourth_ch.trim() ? fourth_ch.split(' ')[1] : '';
    const fourth_all_ch1 = fourth_all_ch.trim() ?fourth_all_ch.split(' ')[0]: '';
    const fourth_all_ch2 = fourth_all_ch.trim() ?fourth_all_ch.split(' ')[1]: '';
    const reason_ch2 = reason_ch.trim() ? reason_ch.split(' ')[1] : '';
    const rg2_ch2 = rg2_ch.trim() ? rg2_ch.split(' ')[1] : '';
    const ex_reason_ch2= ex_reason_ch.trim() ? ex_reason_ch.split(' ')[1] : '';
    const ex_relationship_ch2 = ex_relationship_ch.trim() ? ex_relationship_ch.split(' ')[1] : '';
    const job3_ch2=job3_ch.trim() ? job3_ch.split(' ')[1] : '';

    // 建構CSV檔案內容
    const csvContent = `${id},${slash},${type},${rg},${rg_ch2},${first},${first_ch2},${first_all_ch1},${first_all_ch2},${second},${second_ch2},${second_all_ch1},${second_all_ch2},${third},${third_ch2},${third_all_ch1},${third_all_ch2},${fourth},${fourth_ch2},${fourth_all_ch1},${fourth_all_ch2},${chome},${address},${of1},${of2},${revise},${origin_address},${o_add_no_checkboxValue},${clan_name},${c_name_no_checkboxValue},${rg2},${rg2_ch2},${yy2},${mm2},${dd2},${reason},${reason_ch2},${ex_reason},${ex_reason_ch2},${o_name},${o_yy2},${o_mm2},${o_dd2},${ex_name},${ex_relationship},${ex_relationship_ch2},${job3},${job3_ch2},${index}\n`;

    // 在每次新增數據時自動增加索引值
    index++;
    
    // 附加到現有的CSV文件
    fs.appendFile('household.csv', csvContent, 'utf-8', (err) => {
        if (err) {
            console.error('Error appending to CSV:', err);
            res.status(500).send({ message: 'Error in generating CSV' });
        } else {
            console.log('Data appended to CSV file successfully');
            res.send({ message: 'CSV generated' });
        }
    });
}

app.post('/modify-householdForm-csv', (req, res) => {
    // 從請求體中取得傳遞的數字
    const id = req.body.id;
    const slash = req.body.slash;
    const type = req.body.type;

    const rg = req.body.rg;
    const rg_ch= req.body.rg_ch;
    const first = req.body.first;
    const first_ch = req.body.first_ch;
    const first_all_ch = req.body.first_all_ch;
    
    const second = req.body.second;
    const second_ch = req.body.second_ch;
    const second_all_ch = req.body.second_all_ch;

    const third = req.body.third;
    const third_ch = req.body.third_ch;
    const third_all_ch = req.body.third_all_ch;
    
    const fourth = req.body.fourth;
    const fourth_ch = req.body.fourth_ch;
    const fourth_all_ch = req.body.fourth_all_ch;

    const chome = req.body.chome;
    const address = req.body.address;
    const of1 = req.body.of1;
    const of2 = req.body.of2;

    const revise=req.body.revise;
    const origin_address = req.body.origin_address;
    const o_add_no_checkboxValue = req.body.o_add_no_checkboxValue;

    const clan_name = req.body.clan_name;
    const c_name_no_checkboxValue = req.body.c_name_no_checkboxValue;

    const rg2 = req.body.rg2;
    const rg2_ch = req.body.rg2_ch;
    const yy2 = req.body.yy2;
    const mm2 = req.body.mm2;
    const dd2 = req.body.dd2;
    const reason = req.body.reason;
    const reason_ch = req.body.reason_ch;
    const ex_reason = req.body.ex_reason;
    const ex_reason_ch = req.body.ex_reason_ch;

    const o_name = req.body.o_name;
    const o_yy2 = req.body.o_yy2;
    const o_mm2 = req.body.o_mm2;
    const o_dd2 = req.body.o_dd2;

    const ex_name = req.body.ex_name;
    const ex_relationship = req.body.ex_relationship;
    const ex_relationship_ch = req.body.ex_relationship_ch;
    const job3 = req.body.job3;
    const job3_ch = req.body.job3_ch;
    const index = req.body.index;

    // 下拉選單中文
    const rg_ch2 = rg_ch.trim() ? rg_ch.split(' ')[1] : '';//rg_ch 是空白的情況下，rg_ch2 也是空白
    const first_ch2 = first_ch.trim() ?first_ch.split(' ')[1]: '';
    const first_all_ch1 = first_all_ch.trim() ?first_all_ch.split(' ')[0]: '';
    const first_all_ch2 = first_all_ch.trim() ?first_all_ch.split(' ')[1]: '';
    const second_ch2 = second_ch.trim() ?second_ch.split(' ')[1]: '';
    const second_all_ch1 = second_all_ch.trim() ?second_all_ch.split(' ')[0]: '';
    const second_all_ch2 = second_all_ch.trim() ?second_all_ch.split(' ')[1]: '';
    const third_ch2 = third_ch.trim() ? third_ch.split(' ')[1] : '';
    const third_all_ch1 = third_all_ch.trim() ?third_all_ch.split(' ')[0]: '';
    const third_all_ch2 = third_all_ch.trim() ?third_all_ch.split(' ')[1]: '';
    const fourth_ch2 = fourth_ch.trim() ? fourth_ch.split(' ')[1] : '';
    const fourth_all_ch1 = fourth_all_ch.trim() ?fourth_all_ch.split(' ')[0]: '';
    const fourth_all_ch2 = fourth_all_ch.trim() ?fourth_all_ch.split(' ')[1]: '';
    const reason_ch2 = reason_ch.trim() ? reason_ch.split(' ')[1] : '';
    const rg2_ch2 = rg2_ch.trim() ? rg2_ch.split(' ')[1] : '';
    const ex_reason_ch2= ex_reason_ch.trim() ? ex_reason_ch.split(' ')[1] : '';
    const ex_relationship_ch2 = ex_relationship_ch.trim() ? ex_relationship_ch.split(' ')[1] : '';
    const job3_ch2=job3_ch.trim() ? job3_ch.split(' ')[1] : '';

    // 读取 CSV 文件的内容
    fs.readFile(csvFilePath2, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading CSV:', err);
            res.status(500).send({ message: 'Error in modifying CSV' });
            return;
        }

        // 讀取 CSV 文件的内容
        let rows = data.trim().split('\n');
        // 將內容按行拆分
        if (index >= 0 && index < rows.length) {
            // 將輸入框內容拚結成一行
            const newRow = `${id},${slash},${type},${rg},${rg_ch2},${first},${first_ch2},${first_all_ch1},${first_all_ch2},${second},${second_ch2},${second_all_ch1},${second_all_ch2},${third},${third_ch2},${third_all_ch1},${third_all_ch2},${fourth},${fourth_ch2},${fourth_all_ch1},${fourth_all_ch2},${chome},${address},${of1},${of2},${revise},${origin_address},${o_add_no_checkboxValue},${clan_name},${c_name_no_checkboxValue},${rg2},${rg2_ch2},${yy2},${mm2},${dd2},${reason},${reason_ch2},${ex_reason},${ex_reason_ch2},${o_name},${o_yy2},${o_mm2},${o_dd2},${ex_name},${ex_relationship},${ex_relationship_ch2},${job3},${job3_ch2},${index}`;
            // 覆蓋到原始 CSV 行
            rows[index] = newRow;

            // 將修改後的內容寫回csv
            const modifiedData = rows.join('\n')+ '\n';;
            fs.writeFile(csvFilePath2, modifiedData, 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing modified CSV:', err);
                    res.status(500).send({ message: 'Error in modifying CSV' });
                    return;
                }
                res.send({ message: 'CSV modified' });
            });
        } else {
            res.status(400).send({ message: 'Invalid index' });
        }
    });
});

// 在應用程序啟動時讀取 CSV 文件以獲取最後一行的索引值
fs.readFile('person.csv', 'utf-8', (err, data) => {
    if (!err) {
        const lines = data.trim().split('\n');
        if (lines.length > 1) {
            const lastLine = lines[lines.length - 1];
            const lastLineParts = lastLine.split(',');
            if (lastLineParts.length > 0) {
                index2 = parseInt(lastLineParts[lastLineParts.length - 1]) + 1;
            }
        }
    }
});

// 成員
app.post('/generate-csv', (req, res) => {
    // 從請求體中取得傳遞的數字
    const id1 = req.body.id1;
    const perno = req.body.perno;
    const slash2 = req.body.slash2;
    const name = req.body.name;
    const name2 = req.body.name2;
    const name3 = req.body.name3;
    const name4 = req.body.name4;
    const name5 = req.body.name5;
    const reign = req.body.reign;
    const reign_ch = req.body.reign_ch;
    const yy = req.body.yy;
    const mm = req.body.mm;
    const dd = req.body.dd;
    const sex = req.body.sex;
    const father = req.body.father;
    const mother = req.body.mother;
    const porder = req.body.porder;
    const porder_ch = req.body.porder_ch;
    const relationship = req.body.relationship;
    const relationship_ch = req.body.relationship_ch;
    const job1 = req.body.job1;
    const job1_ch = req.body.job1_ch;
    const job2 = req.body.job2;
    const job2_ch = req.body.job2_ch;
    const race = req.body.race;
    const race_ch = req.body.race_ch;
    const opium = req.body.opium;
    const opium_ch = req.body.opium_ch;
    const foot_binding = req.body.foot_binding;
    const foot_binding_ch = req.body.foot_binding_ch;
    const relevant_ys = req.body.relevant_ys;
    const initial_relationship1 = req.body.initial_relationship1;
    const initial_relationship1_ch = req.body.initial_relationship1_ch;
    const relevant_person1 = req.body.relevant_person1;
    const initial_relationship2 = req.body.initial_relationship2;
    const initial_relationship2_ch = req.body.initial_relationship2_ch;
    const relevant_person2 = req.body.relevant_person2;
    

    // 檢查文件是否存在
    fs.access(csvFilePath, fs.constants.F_OK, (err) => {
        if (err) {
            // 如果文件不存在，寫入標題並附加數據
            const csvHeader = '戶號HID,人號PID,是否有斜線,名字,名字2,名字3,名字4,名字5,性別,reign,年號,年,月,日,父親,母親,porder,出生別,relationship,續柄,job1,職業1,job2,職業2,race,種族,opium,阿片,foot_binding,纏足,是否有變更續柄,initial_relationship1,初始關係1,relevant_person1,initial_relationship2,初始關係2,relevant_person2,index\n';
            fs.writeFile(csvFilePath, csvHeader, 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing CSV header:', err);
                    res.status(500).send({ message: 'Error in generating CSV' });
                    return;
                }
                appendDataToCSV(id1,perno,slash2, name,name2,name3,name4,name5, sex, reign,reign_ch, yy, mm, dd,father,mother,porder,porder_ch,relationship,relationship_ch,job1,job1_ch,job2,job2_ch,race,race_ch,opium,opium_ch,foot_binding,foot_binding_ch,relevant_ys,initial_relationship1,initial_relationship1_ch,relevant_person1,initial_relationship2,initial_relationship2_ch,relevant_person2,res);
            });
        } else {
            // 文件存在，附加數據
            fs.readFile(csvFilePath, 'utf-8', (err, data) => {
                if (err) {
                    console.error('Error reading CSV:', err);
                    res.status(500).send({ message: 'Error in generating CSV' });
                    return;
                }
                appendDataToCSV(id1,perno,slash2, name,name2,name3,name4,name5, sex, reign,reign_ch, yy, mm, dd,father,mother,porder,porder_ch,relationship,relationship_ch,job1,job1_ch,job2,job2_ch,race,race_ch,opium,opium_ch,foot_binding,foot_binding_ch,relevant_ys,initial_relationship1,initial_relationship1_ch,relevant_person1,initial_relationship2,initial_relationship2_ch,relevant_person2, res);
            });
        }
    });
});

let index2 = 1; // 定義一個全局變量，用於自動增加索引值

function appendDataToCSV(id1, perno,slash2,name,name2,name3,name4,name5, sex, reign,reign_ch, yy, mm, dd,father,mother,porder,porder_ch,relationship,relationship_ch,job1,job1_ch,job2,job2_ch,race,race_ch,opium,opium_ch,foot_binding,foot_binding_ch,relevant_ys,initial_relationship1,initial_relationship1_ch,relevant_person1,initial_relationship2,initial_relationship2_ch,relevant_person2,res) {
    //中文
    const reign_ch2 = reign_ch.trim() ? reign_ch.split(' ')[1] : '';
    const porder_ch2=porder_ch.trim() ? porder_ch.split(' ')[1] : '';
    const relationship_ch2=relationship_ch.trim() ? relationship_ch.split(' ')[1] : '';
    const job1_ch2=job1_ch.trim() ? job1_ch.split(' ')[1] : '';
    const job2_ch2=job2_ch.trim() ? job2_ch.split(' ')[1] : '';
    const race_ch2=race_ch.trim() ? race_ch.split(' ')[1] : '';
    const opium_ch2=opium_ch.trim() ? opium_ch.split(' ')[1] : '';
    const foot_binding_ch2=foot_binding_ch.trim() ? foot_binding_ch.split(' ')[1] : '';
    const initial_relationship1_ch2=initial_relationship1_ch.trim() ? initial_relationship1_ch.split(' ')[1] : '';
    const initial_relationship2_ch2=initial_relationship2_ch.trim() ? initial_relationship2_ch.split(' ')[1] : '';
    // 建構CSV檔案內容
    const csvContent = `${id1},${perno},${slash2},${name},${name2},${name3},${name4},${name5},${sex},${reign},${reign_ch2},${yy},${mm},${dd},${father},${mother},${porder},${porder_ch2},${relationship},${relationship_ch2},${job1},${job1_ch2},${job2},${job2_ch2},${race},${race_ch2},${opium},${opium_ch2},${foot_binding},${foot_binding_ch2},${relevant_ys},${initial_relationship1},${initial_relationship1_ch2},${relevant_person1},${initial_relationship2},${initial_relationship2_ch2},${relevant_person2},${index2}\n`;

    // 在每次新增數據時自動增加索引值
    index2++;

    // 附加到現有的CSV文件
    fs.appendFile('person.csv', csvContent, 'utf-8', (err) => {
        if (err) {
            console.error('Error appending to CSV:', err);
            res.status(500).send({ message: 'Error in generating CSV' });
        } else {
            console.log('Data appended to CSV file successfully');
            res.send({ message: 'CSV generated' });
        }
    });
}
//修改成員
app.post('/modify-generate-csv', (req, res) => {
    // 從請求體中取得傳遞的數字
    const id1 = req.body.id1;
    const perno = req.body.perno;
    const slash2 = req.body.slash2;
    const name = req.body.name;
    const name2 = req.body.name2;
    const name3 = req.body.name3;
    const name4 = req.body.name4;
    const name5 = req.body.name5;
    const reign = req.body.reign;
    const reign_ch = req.body.reign_ch;
    const yy = req.body.yy;
    const mm = req.body.mm;
    const dd = req.body.dd;
    const sex = req.body.sex;
    const father = req.body.father;
    const mother = req.body.mother;
    const porder = req.body.porder;
    const porder_ch = req.body.porder_ch;
    const relationship = req.body.relationship;
    const relationship_ch = req.body.relationship_ch;
    const job1 = req.body.job1;
    const job1_ch = req.body.job1_ch;
    const job2 = req.body.job2;
    const job2_ch = req.body.job2_ch;
    const race = req.body.race;
    const race_ch = req.body.race_ch;
    const opium = req.body.opium;
    const opium_ch = req.body.opium_ch;
    const foot_binding = req.body.foot_binding;
    const foot_binding_ch = req.body.foot_binding_ch;
    const relevant_ys = req.body.relevant_ys;
    const initial_relationship1 = req.body.initial_relationship1;
    const initial_relationship1_ch = req.body.initial_relationship1_ch;
    const relevant_person1 = req.body.relevant_person1;
    const initial_relationship2 = req.body.initial_relationship2;
    const initial_relationship2_ch = req.body.initial_relationship2_ch;
    const relevant_person2 = req.body.relevant_person2;
    const index2 = req.body.index2;

    // 下拉選單中文
    const reign_ch2 = reign_ch.trim() ? reign_ch.split(' ')[1] : '';
    const porder_ch2=porder_ch.trim() ? porder_ch.split(' ')[1] : '';
    const relationship_ch2=relationship_ch.trim() ? relationship_ch.split(' ')[1] : '';
    const job1_ch2=job1_ch.trim() ? job1_ch.split(' ')[1] : '';
    const job2_ch2=job2_ch.trim() ? job2_ch.split(' ')[1] : '';
    const race_ch2=race_ch.trim() ? race_ch.split(' ')[1] : '';
    const opium_ch2=opium_ch.trim() ? opium_ch.split(' ')[1] : '';
    const foot_binding_ch2=foot_binding_ch.trim() ? foot_binding_ch.split(' ')[1] : '';
    const initial_relationship1_ch2=initial_relationship1_ch.trim() ? initial_relationship1_ch.split(' ')[1] : '';
    const initial_relationship2_ch2=initial_relationship2_ch.trim() ? initial_relationship2_ch.split(' ')[1] : '';

    // 讀取 CSV 文件的内容
    fs.readFile(csvFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading CSV:', err);
            res.status(500).send({ message: 'Error in modifying CSV' });
            return;
        }

        const newRow2 = `${id1},${perno},${slash2},${name},${name2},${name3},${name4},${name5},${sex},${reign},${reign_ch2},${yy},${mm},${dd},${father},${mother},${porder},${porder_ch2},${relationship},${relationship_ch2},${job1},${job1_ch2},${job2},${job2_ch2},${race},${race_ch2},${opium},${opium_ch2},${foot_binding},${foot_binding_ch2},${relevant_ys},${initial_relationship1},${initial_relationship1_ch2},${relevant_person1},${initial_relationship2},${initial_relationship2_ch2},${relevant_person2},${index2}`;
        console.log(newRow2)
        fs.readFile(csvFilePath, 'utf-8', (err, data) => {
            if (err) {
                console.error('文件錯誤:', err);
                return;
            }

            let rows = data.split('\n');
            const header = rows[0].split(',');

            const indexColumn = header.indexOf('index');
            if (indexColumn === -1) {
                console.error('未找到"index" 的列');
                return;
            }
            const updatedRows = rows.map((row, rowIndex) => {
                if (rowIndex === 0) {
                    return row;
                }

                const columns = row.split(',');
                if (columns[indexColumn] === index2) {
                    console.log(`Found target row with index ${index2}:`, row);
                    return newRow2
                }
                return row;
            });
            const updatedCsvData = updatedRows.join('\n');

            // 更新csv
            fs.writeFile(csvFilePath, updatedCsvData, (err) => {
                if (err) {
                    console.error('Error writing modified CSV:', err);
                    res.status(500).send({ message: 'Error in modifying CSV' });
                    return;
                } else {
                    res.send({ message: 'CSV modified' });
                }
            });
        });
    });
});

// 監聽指定端口，啟動伺服器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// 在應用程序啟動時讀取 CSV 文件以獲取最後一行的索引值
fs.readFile('event.csv', 'utf-8', (err, data) => {
    if (!err) {
        const lines = data.trim().split('\n');
        if (lines.length > 1) {
            const lastLine = lines[lines.length - 1];
            const lastLineParts = lastLine.split(',');
            if (lastLineParts.length > 0) {
                index3 = parseInt(lastLineParts[lastLineParts.length - 1]) + 1;
            }
        }
    }
});

// 事件
app.post('/generate-eventForm-csv', (req, res) => {
    // 從請求體中取得傳遞的數字
    const id2 = req.body.id2;
    const perno2 = req.body.perno2;
    const rg3 = req.body.rg3;
    const rg3_ch = req.body.rg3_ch;
    const yy3 = req.body.yy3;
    const mm3 = req.body.mm3;
    const dd3 = req.body.dd3;
    const no3 = req.body.no3;
    const event = req.body.event;
    const event_ch = req.body.event_ch;

    const relevant_person3 = req.body.relevant_person3;
    const type2 = req.body.type2;
    const relationInput = req.body.relationInput;
    const relationInput_ch = req.body.relationInput_ch;

    const name2 = req.body.name2;
    const relationshipInput2 = req.body.relationshipInput2;
    const relationshipInput2_ch = req.body.relationshipInput2_ch;

    const rg_event = req.body.rg_event;
    const rg_event_ch = req.body.rg_event_ch;
    const first_event = req.body.first_event;
    const first_event_ch = req.body.first_event_ch;
    const first_all_event_ch = req.body.first_all_event_ch;

    const second_event = req.body.second_event;
    const second_event_ch = req.body.second_event_ch;
    const second_all_event_ch = req.body.second_all_event_ch;

    const third_event = req.body.third_event;
    const third_event_ch = req.body.third_event_ch;
    const third_all_event_ch = req.body.third_all_event_ch;

    const fourth_event = req.body.fourth_event;
    const fourth_event_ch = req.body.fourth_event_ch;
    const fourth_all_event_ch = req.body.fourth_all_event_ch;

    const chome_event = req.body.chome_event;
    const address_event = req.body.address_event;
    const of1_event = req.body.of1_event;
    const of2_event = req.body.of2_event;

    // 檢查文件是否存在
    fs.access(csvFilePath3, fs.constants.F_OK, (err) => {
        if (err) {
            // 如果文件不存在，寫入標題並附加數據
            const csvHeader = '戶號HID,人號PID,rg,年號,年,月,日,事件序次,event,事件,事件關係人姓名,本戶或他戶,relation,與事件本人關係,他戶戶主姓名,relationship,與本戶或他戶戶主的關係,rg2,年號2,adrlevel1,adr1tp,adr1cd,地名1,adrlevel2,adr1tp2,adr1cd2,地名2,adrlevel3,adr1tp3,adr1cd3,地名3,adrlevel4,adr1tp4,adr1cd4,地名4,chome,address,of1,of2,index\n'; 
            fs.writeFile(csvFilePath3, csvHeader, 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing CSV header:', err);
                    res.status(500).send({ message: 'Error in generating CSV' });
                    return;
                }
                appendDataToCSV3(id2,perno2,rg3,rg3_ch,yy3,mm3,dd3,no3,event,event_ch,relevant_person3,type2,relationInput,relationInput_ch,name2,relationshipInput2,relationshipInput2_ch,rg_event,rg_event_ch,first_event,first_event_ch,first_all_event_ch,first_all_event_ch,second_event,second_event_ch,second_all_event_ch,second_all_event_ch,third_event,third_event_ch,third_all_event_ch,third_all_event_ch,fourth_event,fourth_event_ch,fourth_all_event_ch,fourth_all_event_ch,chome_event,address_event,of1_event,of2_event,res);
            });
        } else {
            // 文件存在，附加數據
            fs.readFile(csvFilePath3, 'utf-8', (err, data) => {
                if (err) {
                    console.error('Error reading CSV:', err);
                    res.status(500).send({ message: 'Error in generating CSV' });
                    return;
                }
                appendDataToCSV3(id2,perno2,rg3,rg3_ch,yy3,mm3,dd3,no3,event,event_ch,relevant_person3,type2,relationInput,relationInput_ch,name2,relationshipInput2,relationshipInput2_ch,rg_event,rg_event_ch,first_event,first_event_ch,first_all_event_ch,first_all_event_ch,second_event,second_event_ch,second_all_event_ch,second_all_event_ch,third_event,third_event_ch,third_all_event_ch,third_all_event_ch,fourth_event,fourth_event_ch,fourth_all_event_ch,fourth_all_event_ch,chome_event,address_event,of1_event,of2_event,res);
            });
        }
    });
});

let index3 = 1; // 定義一個全局變量，用於自動增加索引值

function appendDataToCSV3(id2,perno2,rg3,rg3_ch,yy3,mm3,dd3,no3,event,event_ch,relevant_person3,type2,relationInput,relationInput_ch,name2,relationshipInput2,relationshipInput2_ch,rg_event,rg_event_ch,first_event,first_event_ch,first_all_event_ch,first_all_event_ch,second_event,second_event_ch,second_all_event_ch,second_all_event_ch,third_event,third_event_ch,third_all_event_ch,third_all_event_ch,fourth_event,fourth_event_ch,fourth_all_event_ch,fourth_all_event_ch,chome_event,address_event,of1_event,of2_event,res) {
    // 下拉選單中文
    const rg3_ch2 = rg3_ch.trim() ? rg3_ch.split(' ')[1] : '';
    const event_ch2 = event_ch.trim() ? event_ch.split(' ')[1] : '';
    const relationInput_ch2 = relationInput_ch.trim() ? relationInput_ch.split(' ')[1] : '';
    const relationshipInput2_ch2 = relationshipInput2_ch.trim() ? relationshipInput2_ch.split(' ')[1] : '';
    const rg_event_ch2 = rg_event_ch.trim() ? rg_event_ch.split(' ')[1] : '';
    const first_event_ch2 = first_event_ch.trim() ? first_event_ch.split(' ')[1] : '';
    const first_all_event_ch1 = first_all_event_ch.trim() ? first_all_event_ch.split(' ')[0] : '';
    const first_all_event_ch2 = first_all_event_ch.trim() ? first_all_event_ch.split(' ')[1] : '';
    const second_event_ch2 = second_event_ch.trim() ? second_event_ch.split(' ')[1] : '';
    const second_all_event_ch1 = second_all_event_ch.trim() ? second_all_event_ch.split(' ')[0] : '';
    const second_all_event_ch2 = second_all_event_ch.trim() ? second_all_event_ch.split(' ')[1] : '';
    const third_event_ch2 = third_event_ch.trim() ? third_event_ch.split(' ')[1] : '';
    const third_all_event_ch1 = third_all_event_ch.trim() ? third_all_event_ch.split(' ')[0] : '';
    const third_all_event_ch2 = third_all_event_ch.trim() ? third_all_event_ch.split(' ')[1] : '';
    const fourth_event_ch2 = fourth_event_ch.trim() ? fourth_event_ch.split(' ')[1] : '';
    const fourth_all_event_ch1 = fourth_all_event_ch.trim() ? fourth_all_event_ch.split(' ')[0] : '';
    const fourth_all_event_ch2 = fourth_all_event_ch.trim() ? fourth_all_event_ch.split(' ')[1] : '';


    // 建構CSV檔案內容
    const csvContent = `${id2},${perno2},${rg3},${rg3_ch2},${yy3},${mm3},${dd3},${no3},${event},${event_ch2},${relevant_person3},${type2},${relationInput},${relationInput_ch2},${name2},${relationshipInput2},${relationshipInput2_ch2},${rg_event},${rg_event_ch2},${first_event},${first_event_ch2},${first_all_event_ch1},${first_all_event_ch2},${second_event},${second_event_ch2},${second_all_event_ch1},${second_all_event_ch2},${third_event},${third_event_ch2},${third_all_event_ch1},${third_all_event_ch2},${fourth_event},${fourth_event_ch2},${fourth_all_event_ch1},${fourth_all_event_ch2},${chome_event},${address_event},${of1_event},${of2_event},${index3}\n`;

    // 在每次新增數據時自動增加索引值
    index3++;

    // 附加到現有的CSV文件
    fs.appendFile('event.csv', csvContent, 'utf-8', (err) => {
        if (err) {
            console.error('Error appending to CSV:', err);
            res.status(500).send({ message: 'Error in generating CSV' });
        } else {
            console.log('Data appended to CSV file successfully');
            res.send({ message: 'CSV generated' });
        }
    });
}

//修改事件
app.post('/modify-eventForm-csv', (req, res) => {
    // 從請求體中取得傳遞的數字
    const id2 = req.body.id2;
    const perno2 = req.body.perno2;
    const rg3 = req.body.rg3;
    const rg3_ch = req.body.rg3_ch;
    const yy3 = req.body.yy3;
    const mm3 = req.body.mm3;
    const dd3 = req.body.dd3;
    const no3 = req.body.no3;
    const event = req.body.event;
    const event_ch = req.body.event_ch;

    const relevant_person3 = req.body.relevant_person3;
    const type2 = req.body.type2;
    const relationInput = req.body.relationInput;
    const relationInput_ch = req.body.relationInput_ch;

    const name2 = req.body.name2;
    const relationshipInput2 = req.body.relationshipInput2;
    const relationshipInput2_ch = req.body.relationshipInput2_ch;

    const rg_event = req.body.rg_event;
    const rg_event_ch = req.body.rg_event_ch;
    const first_event = req.body.first_event;
    const first_event_ch = req.body.first_event_ch;
    const first_all_event_ch = req.body.first_all_event_ch;

    const second_event = req.body.second_event;
    const second_event_ch = req.body.second_event_ch;
    const second_all_event_ch = req.body.second_all_event_ch;

    const third_event = req.body.third_event;
    const third_event_ch = req.body.third_event_ch;
    const third_all_event_ch = req.body.third_all_event_ch;

    const fourth_event = req.body.fourth_event;
    const fourth_event_ch = req.body.fourth_event_ch;
    const fourth_all_event_ch = req.body.fourth_all_event_ch;

    const chome_event = req.body.chome_event;
    const address_event = req.body.address_event;
    const of1_event = req.body.of1_event;
    const of2_event = req.body.of2_event;
    const index3 = req.body.index3;

    const rg3_ch2 = rg3_ch.trim() ? rg3_ch.split(' ')[1] : '';
    const event_ch2 = event_ch.trim() ? event_ch.split(' ')[1] : '';
    const relationInput_ch2 = relationInput_ch.trim() ? relationInput_ch.split(' ')[1] : '';
    const relationshipInput2_ch2 = relationshipInput2_ch.trim() ? relationshipInput2_ch.split(' ')[1] : '';
    const rg_event_ch2 = rg_event_ch.trim() ? rg_event_ch.split(' ')[1] : '';
    const first_event_ch2 = first_event_ch.trim() ? first_event_ch.split(' ')[1] : '';
    const first_all_event_ch1 = first_all_event_ch.trim() ? first_all_event_ch.split(' ')[0] : '';
    const first_all_event_ch2 = first_all_event_ch.trim() ? first_all_event_ch.split(' ')[1] : '';
    const second_event_ch2 = second_event_ch.trim() ? second_event_ch.split(' ')[1] : '';
    const second_all_event_ch1 = second_all_event_ch.trim() ? second_all_event_ch.split(' ')[0] : '';
    const second_all_event_ch2 = second_all_event_ch.trim() ? second_all_event_ch.split(' ')[1] : '';
    const third_event_ch2 = third_event_ch.trim() ? third_event_ch.split(' ')[1] : '';
    const third_all_event_ch1 = third_all_event_ch.trim() ? third_all_event_ch.split(' ')[0] : '';
    const third_all_event_ch2 = third_all_event_ch.trim() ? third_all_event_ch.split(' ')[1] : '';
    const fourth_event_ch2 = fourth_event_ch.trim() ? fourth_event_ch.split(' ')[1] : '';
    const fourth_all_event_ch1 = fourth_all_event_ch.trim() ? fourth_all_event_ch.split(' ')[0] : '';
    const fourth_all_event_ch2 = fourth_all_event_ch.trim() ? fourth_all_event_ch.split(' ')[1] : '';

    // 讀取 CSV 文件的内容
    fs.readFile(csvFilePath3, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading CSV:', err);
            res.status(500).send({ message: 'Error in modifying CSV' });
            return;
        }

        // 將內容按行拆分
        let rows3 = data.trim().split('\n');
        // 根據索引找到要修改的行
        if (index3 >= 0 && index3 < rows3.length) {
            // 將輸入框內容拚結成一行
            const newRow3 = `${id2},${perno2},${rg3},${rg3_ch2},${yy3},${mm3},${dd3},${no3},${event},${event_ch2},${relevant_person3},${type2},${relationInput},${relationInput_ch2},${name2},${relationshipInput2},${relationshipInput2_ch2},${rg_event},${rg_event_ch2},${first_event},${first_event_ch2},${first_all_event_ch1},${first_all_event_ch2},${second_event},${second_event_ch2},${second_all_event_ch1},${second_all_event_ch2},${third_event},${third_event_ch2},${third_all_event_ch1},${third_all_event_ch2},${fourth_event},${fourth_event_ch2},${fourth_all_event_ch1},${fourth_all_event_ch2},${chome_event},${address_event},${of1_event},${of2_event},${index3}`;

            // 覆蓋到原始 CSV 行
            rows3[index3] = newRow3;

            // 將修改後的內容寫回csv
            const modifiedData3 = rows3.join('\n')+ '\n';;
            fs.writeFile(csvFilePath3, modifiedData3, 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing modified CSV:', err);
                    res.status(500).send({ message: 'Error in modifying CSV' });
                    return;
                }
                res.send({ message: 'CSV modified' });
            });
        } else {
            res.status(400).send({ message: 'Invalid index' });
        }
    });
});

// 在應用程序啟動時讀取 CSV 文件以獲取最後一行的索引值
fs.readFile('special.csv', 'utf-8', (err, data) => {
    if (!err) {
        const lines = data.trim().split('\n');
        if (lines.length > 1) {
            const lastLine = lines[lines.length - 1];
            const lastLineParts = lastLine.split(',');
            if (lastLineParts.length > 0) {
                index4 = parseInt(lastLineParts[lastLineParts.length - 1]) + 1;
            }
        }
    }
});
// 特殊情況
app.post('/generate-specialForm-csv', (req, res) => {
    // 從請求體中取得傳遞的數字
    const id4 = req.body.id4;
    const perno4 = req.body.perno4;
    const special_event = req.body.special_event;

    // 檢查文件是否存在
    fs.access(csvFilePath4, fs.constants.F_OK, (err) => {
        if (err) {
            // 如果文件不存在，寫入標題並附加數據
            const csvHeader = 'id,perno,特殊情況,index\n'; 
            fs.writeFile(csvFilePath4, csvHeader, 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing CSV header:', err);
                    res.status(500).send({ message: 'Error in generating CSV' });
                    return;
                }
                appendDataToCSV4(id4,perno4,special_event,res);
            });
        } else {
            // 文件存在，附加數據
            fs.readFile(csvFilePath4, 'utf-8', (err, data) => {
                if (err) {
                    console.error('Error reading CSV:', err);
                    res.status(500).send({ message: 'Error in generating CSV' });
                    return;
                }
                appendDataToCSV4(id4,perno4,special_event,res);
            });
        }
    });
});

let index4 = 1; // 定義一個全局變量，用於自動增加索引值

function appendDataToCSV4(id4,perno4,special_event,res) {

    // 建構CSV檔案內容
    const csvContent = `${id4},${perno4},${special_event},${index4}\n`;
    // 在每次新增數據時自動增加索引值
    index4++;
    // 附加到現有的CSV文件
    fs.appendFile('special.csv', csvContent, 'utf-8', (err) => {
        if (err) {
            console.error('Error appending to CSV:', err);
            res.status(500).send({ message: 'Error in generating CSV' });
        } else {
            console.log('Data appended to CSV file successfully');
            res.send({ message: 'CSV generated' });
        }
    });
}

//修改特殊事件
app.post('/modify-specialForm-csv', (req, res) => {
    // 從請求體中取得傳遞的數字
    const id4 = req.body.id4;
    const perno4 = req.body.perno4;
    const special_event = req.body.special_event;
    const index4 = req.body.index4;

    // 讀取 CSV 文件的内容
    fs.readFile(csvFilePath4, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading CSV:', err);
            res.status(500).send({ message: 'Error in modifying CSV' });
            return;
        }

        // 将内容按行拆分为数组
        let rows4 = data.trim().split('\n');

        // 根據索引找到要修改的行
        if (index4 >= 0 && index4 < rows4.length) {
            // 將輸入框內容拚結成一行
            const newRow4 = `${id4},${perno4},${special_event},${index4}`; 

            // 覆蓋到原始 CSV 行
            rows4[index4] = newRow4;

            // 將修改後的內容寫回csv
            const modifiedData4 = rows4.join('\n')+ '\n';
            fs.writeFile(csvFilePath4, modifiedData4, 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing modified CSV:', err);
                    res.status(500).send({ message: 'Error in modifying CSV' });
                    return;
                }
                res.send({ message: 'CSV modified' });
            });
        } else {
            res.status(400).send({ message: 'Invalid index' });
        }
    });
});


const chokidar = require('chokidar');
const csv = require('csv-parser');

const filePath = './person.csv'; 
const filePath3 = './event.csv'; 
let persondata = [];


function readCSVFile() {
    persondata = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            persondata.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
        });
}
let eventdata = []

function readCSVFile3() {
    eventdata = [];
    fs.createReadStream(filePath3)
        .pipe(csv())
        .on('data', (row) => {
            eventdata.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
        });
}

// Initialize file reading and set up file monitoring
readCSVFile();
readCSVFile3();
const { parse } = require('csv-parse');
const { stringify } = require('csv-stringify');

const watcher = chokidar.watch(filePath, { persistent: true });
const watcher2 = chokidar.watch(filePath3, { persistent: true });


watcher
    .on('change', (path) => {
        console.log(`${path} has been changed. Reloading data...`);
        readCSVFile();
        readCSVFile3();
    })
    .on('unlink', (path) => {
        console.log(`${path} has been deleted.`);
        persondata = [];
        eventdata = [];
    });
watcher2
    .on('change', (path) => {
        console.log(`${path} has been changed. Reloading data...`);
        readCSVFile();
        readCSVFile3();
    })
    .on('unlink', (path) => {
        console.log(`${path} has been deleted.`);
        persondata = [];
        eventdata = [];
    });




    function compareRows(persondata) {
        const results = [];
    
        for (let i = 0; i < persondata.length; i++) {
            for (let j = i + 1; j < persondata.length; j++) {
                let commonCount = 0;
                const keys = Object.keys(persondata[i]);
                const validKeys = ['名字', '性別', '父親', '母親', '出生別'];
                keys.forEach((key) => {
                    if (validKeys.includes(key) && persondata[i][key] === persondata[j][key]) {
                        commonCount++;
                    }
                });
                const date1 = `${persondata[i]['年號']}-${persondata[i]['年']}-${persondata[i]['月']}-${persondata[i]['日']}`;
                const date2 = `${persondata[j]['年號']}-${persondata[j]['年']}-${persondata[j]['月']}-${persondata[j]['日']}`;
                if (persondata[i]['index'] !== persondata[j]['index'] && date1 === date2) {
                    commonCount++;
                }
    
                if (commonCount >= 4) {
                    results.push({
                        row1: i + 1,
                        row2: j + 1,
                        commonFields: commonCount,
                        rowData1: persondata[i],
                        rowData2: persondata[j],
                    });
                }
                //}
            }
        }
        results.sort((a, b) => b.commonFields - a.commonFields);
        return results;
    }
    // API Endpoint to get comparison results
    app.get('/api/compare', (req, res) => {
        const results = compareRows(persondata);
        res.json(results);
    });
    
    function EventcompareRows(eventdata) {
        const results = [];
    
        for (let i = 0; i < eventdata.length; i++) {
            for (let j = i + 1; j < eventdata.length; j++) {
                // 首先检查名字是否相同
                //if (eventdata[i].name === eventdata[j].name) {
                let commonCount = 0;
                const keys = Object.keys(eventdata[i]);
    
                const validKeys = ['人號PID', 'event'];
                keys.forEach((key) => {
                    if (validKeys.includes(key) && eventdata[i][key] === eventdata[j][key]) {
                        commonCount++;
                    }
                });
                const date1 = `${eventdata[i]['年號']}-${eventdata[i]['年']}-${eventdata[i]['月']}-${eventdata[i]['日']}`;
                const date2 = `${eventdata[j]['年號']}-${eventdata[j]['年']}-${eventdata[j]['月']}-${eventdata[j]['日']}`;
                if (eventdata[i]['index'] !== eventdata[j]['index'] && date1 === date2) {
                    commonCount++;
                }
    
                if (commonCount >= 2) {
                    results.push({
                        row1: i + 1,
                        row2: j + 1,
                        commonFields: commonCount,
                        rowData1: eventdata[i],
                        rowData2: eventdata[j],
                    });
                }
                //}
            }
        }
        results.sort((a, b) => b.commonFields - a.commonFields);
        return results;
    }
    
    app.get('/event/compare', (req, res) => {
    
        const results = EventcompareRows(eventdata);
        res.json(results);
    });
    
    app.post('/api/delete', (req, res) => {
        const { id } = req.body;
    
        if (typeof id !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid ID' });
        }
    
        fs.readFile('./person.csv', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading CSV file:', err);
                return res.status(500).json({ success: false, message: 'Error reading CSV file' });
            }
    
            parse(data, { columns: true, trim: true }, (parseErr, records) => {
                if (parseErr) {
                    console.error('Error parsing CSV file:', parseErr);
                    return res.status(500).json({ success: false, message: 'Error parsing CSV file' });
                }
    
                // Filter out the records that have the specified id
                const updatedRecords = records.filter(record => record.index !== id);
    
                // Write the updated records back to the CSV file
                stringify(updatedRecords, { header: true }, (stringifyErr, output) => {
                    if (stringifyErr) {
                        console.error('Error converting records to CSV:', stringifyErr);
                        return res.status(500).json({ success: false, message: 'Error converting records to CSV' });
                    }
    
                    fs.writeFile('./person.csv', output, 'utf8', (writeErr) => {
                        if (writeErr) {
                            console.error('Error writing CSV file:', writeErr);
                            return res.status(500).json({ success: false, message: 'Error writing CSV file' });
                        }
    
                        res.json({ success: true });
                    });
                });
            });
        });
    });
    app.post('/api/event/delete', (req, res) => {
        const { id } = req.body;
    
        if (typeof id !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid ID' });
        }
    
        fs.readFile('./event.csv', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading CSV file:', err);
                return res.status(500).json({ success: false, message: 'Error reading CSV file' });
            }
    
            parse(data, { columns: true, trim: true }, (parseErr, records) => {
                if (parseErr) {
                    console.error('Error parsing CSV file:', parseErr);
                    return res.status(500).json({ success: false, message: 'Error parsing CSV file' });
                }
    
                // Filter out the records that have the specified id
                console.log(id)
                const updatedRecords = records.filter(record => record.index !== id);
                // Write the updated records back to the CSV file
                stringify(updatedRecords, { header: true }, (stringifyErr, output) => {
                    if (stringifyErr) {
                        console.error('Error converting records to CSV:', stringifyErr);
                        return res.status(500).json({ success: false, message: 'Error converting records to CSV' });
                    }
    
                    fs.writeFile('./event.csv', output, 'utf8', (writeErr) => {
                        if (writeErr) {
                            console.error('Error writing CSV file:', writeErr);
                            return res.status(500).json({ success: false, message: 'Error writing CSV file' });
                        }
                        res.json({ success: true });
                    });
                });
            });
        });
    });
    app.post('/api/house/delete', (req, res) => {
        const { id } = req.body;
    
        if (typeof id !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid ID' });
        }
    
        fs.readFile('./household.csv', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading CSV file:', err);
                return res.status(500).json({ success: false, message: 'Error reading CSV file' });
            }
    
            parse(data, { columns: true, trim: true }, (parseErr, records) => {
                if (parseErr) {
                    console.error('Error parsing CSV file:', parseErr);
                    return res.status(500).json({ success: false, message: 'Error parsing CSV file' });
                }
    
                // Filter out the records that have the specified id
                console.log(id)
                const updatedRecords = records.filter(record => record.index !== id);
                // Write the updated records back to the CSV file
                stringify(updatedRecords, { header: true }, (stringifyErr, output) => {
                    if (stringifyErr) {
                        console.error('Error converting records to CSV:', stringifyErr);
                        return res.status(500).json({ success: false, message: 'Error converting records to CSV' });
                    }
    
                    fs.writeFile('./household.csv', output, 'utf8', (writeErr) => {
                        if (writeErr) {
                            console.error('Error writing CSV file:', writeErr);
                            return res.status(500).json({ success: false, message: 'Error writing CSV file' });
                        }
                        res.json({ success: true });
                    });
                });
            });
        });
    });
    
    app.post('/houselayer', (req, res) => {
        const { id } = req.body;
        console.log('Received ID:', id);
    
        if (typeof id !== 'string' || !id.trim()) {
            return res.status(400).json({ success: false, message: 'Invalid ID' });
        }
    
        fs.readFile('./household.csv', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading CSV file:', err);
                return res.status(500).json({ success: false, message: 'Error reading CSV file' });
            }
    
            parse(data, { columns: true, trim: true }, (parseErr, records) => {
                if (parseErr) {
                    console.error('Error parsing CSV file:', parseErr);
                    return res.status(500).json({ success: false, message: 'Error parsing CSV file' });
                }
    
                // Filter out the records that have the specified id
                // const filteredRecords = records.filter(record => record.index === id);
                // 假設 `戶號` 是 CSV 文件中的欄位，並且 `戶主` 是標識戶主的欄位
                const results = [];
    
                // 1. 找到符合戶號HID的記錄並新增至results (R1)
                const householdRecords = records.filter(record => record['戶號HID'] === id);
                householdRecords.forEach(record => {
                    record['關聯組'] = 'R1';
                    record['關係人'] = record['戶主姓名'];
                    results.push(record);
                });
    
                // 2. 檢查該戶主是否是其他戶的前戶主，如果是，新增至results (R2)
                householdRecords.forEach(record => {
                    const householdHeadName = record['戶主姓名'];
                    const relatedRecordsR2 = records.filter(r => r['前戶主姓名'] === householdHeadName);
                    relatedRecordsR2.forEach(relatedRecord => {
                        relatedRecord['關聯組'] = 'R1';
                        relatedRecord['關係人'] = householdHeadName;
                        results.push(relatedRecord);
    
                        // 3. 檢查R2中的戶主是否是其他戶的前戶主，如果是，新增至results (R3)
                        const furtherRelatedRecordsR3 = records.filter(r => r['前戶主姓名'] === relatedRecord['戶主姓名']);
                        furtherRelatedRecordsR3.forEach(furtherRelatedRecord => {
                            furtherRelatedRecord['關聯組'] = 'R2';
                            furtherRelatedRecord['關係人'] = relatedRecord['戶主姓名'];
                            results.push(furtherRelatedRecord);
    
                            // 4. 檢查R3中的戶主是否是其他戶的前戶主，如果是，新增至results (R4)
                            const furtherRelatedRecordsR4 = records.filter(r => r['前戶主姓名'] === furtherRelatedRecord['戶主姓名']);
                            furtherRelatedRecordsR4.forEach(furtherRelatedRecordR4 => {
                                furtherRelatedRecordR4['關聯組'] = 'R3';
                                furtherRelatedRecordR4['關係人'] = furtherRelatedRecord['戶主姓名'];
                                results.push(furtherRelatedRecordR4);
                            });
                        });
                    });
                });
    
                if (results.length === 0) {
                    return res.status(404).json({ success: false, message: 'No records found with the given ID' });
                }
    
                res.json(results);
            });
        });
    });