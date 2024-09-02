//選項用txt讀取
function loadDropdownFromTxtFile(txtFilePath, selectId) {
    const selectElement = document.getElementById(selectId);

    // 檢查選單元素是否存在
    if (selectElement) {
        // 清空下拉選單的內容
        selectElement.innerHTML = '';

        // 使用Fetch API讀取txt文件
        fetch(txtFilePath)
            .then(response => response.text())
            .then(data => {
                // 將txt文件的內容分行
                const lines = data.split('\n');

                // 將每一行的內容添加到下拉選單中
                lines.forEach(line => {
                    const option = document.createElement("option");
                    // 使用正則表達式提取文本中的數字部分作為 value
                    const value = line.match(/-?\d+/);
                    option.value = value ? value[0] : ""; // 如果找到數字，設定為 value，否則設為空字符串
                    option.text = line;
                    selectElement.add(option);
                });

                // 將選中索引設為 -1 預設選項空白
                selectElement.selectedIndex = -1;
            })
            .catch(error => console.error(`發生錯誤（${selectId}):`, error));}
}

//選項與對應txt
const txtFilePath1 = "select/menu003_日皇生日.txt";
const selectId1 = "reign";
loadDropdownFromTxtFile(txtFilePath1, selectId1);

const txtFilePath2 = "select/menu009_出生別.txt";
const selectId2 = "porder";
loadDropdownFromTxtFile(txtFilePath2, selectId2);

const txtFilePath3 = "select/menu006_續柄.txt";
const selectId3 = "relationshipInput";
loadDropdownFromTxtFile(txtFilePath3, selectId3);

const txtFilePath4 = "select/menu010_職業.txt";
const selectId4 = "job1";
loadDropdownFromTxtFile(txtFilePath4, selectId4);

const txtFilePath5 = "select/menu010_職業.txt";
const selectId5 = "job2";
loadDropdownFromTxtFile(txtFilePath5, selectId5);

const txtFilePath6 = "select/menu015種族.txt";
const selectId6 = "race";
loadDropdownFromTxtFile(txtFilePath6, selectId6);

const txtFilePath7 = "select/menu011_阿片.txt";
const selectId7 = "opium";
loadDropdownFromTxtFile(txtFilePath7, selectId7);

const txtFilePath8 = "select/menu012_纏足.txt";
const selectId8 = "foot_binding";
loadDropdownFromTxtFile(txtFilePath8, selectId8);

const txtFilePath9 = "select/menu014_初始關係.txt";
const selectId9 = "initial_relationship1";
loadDropdownFromTxtFile(txtFilePath9, selectId9);

const txtFilePath10 = "select/menu014_初始關係.txt";
const selectId10 = "initial_relationship2";
loadDropdownFromTxtFile(txtFilePath10, selectId10);

const txtFilePath11 = "select/menu002_日皇.txt";
const selectId11 = "rg";
loadDropdownFromTxtFile(txtFilePath11, selectId11);

const txtFilePath12 = "select/menu005_戶主事由.txt";
const selectId12 = "reason";
loadDropdownFromTxtFile(txtFilePath12, selectId12);

const txtFilePath13 = "select/menu003_日皇生日.txt";
const selectId13 = "rg2";
loadDropdownFromTxtFile(txtFilePath13, selectId13);

const txtFilePath14 = "select/menu003_日皇生日.txt";
const selectId14 = "rg3";
loadDropdownFromTxtFile(txtFilePath14, selectId14);

const txtFilePath15 = "select/menu013_事件.txt";
const selectId15= "event";
loadDropdownFromTxtFile(txtFilePath15, selectId15);

const txtFilePath16 = "select/menu006_續柄.txt";
const selectId16= "relationInput";
loadDropdownFromTxtFile(txtFilePath16, selectId16);

const txtFilePath17 = "select/menu006_續柄.txt";
const selectId17= "relationshipInput2";
loadDropdownFromTxtFile(txtFilePath17, selectId17);

const txtFilePath18 = "select/menu002_日皇.txt";
const selectId18= "rg_event";
loadDropdownFromTxtFile(txtFilePath18, selectId18);

const txtFilePath19 = "select/menu001_前戶主事由.txt";
const selectId19= "ex_reason";
loadDropdownFromTxtFile(txtFilePath19, selectId19);

const txtFilePath20 = "select/menu006_續柄.txt";
const selectId20= "ex_relationshipInput";
loadDropdownFromTxtFile(txtFilePath20, selectId20);

const txtFilePath21 = "select/menu010_職業.txt";
const selectId21 = "job3";
loadDropdownFromTxtFile(txtFilePath21, selectId21);

function handleRgChange(first,rg) {
    // 獲取選中的年號
    const selectedYearText = document.getElementById(rg).value;

    // 使用正則表達式提取年號的數字部分
    const selectedYear = selectedYearText.match(/\d+/)[0];

    // 調用函數來更新first
    updateFirst(selectedYear,first);
}

// 調用函數
//document.getElementById("rg").addEventListener("change", function () {
//    handleRgChange("first","rg");
//});
document.addEventListener("DOMContentLoaded", function() {
    const rgElement = document.getElementById("rg");

    // 檢查元素是否存在
    if (rgElement) {
        rgElement.addEventListener("change", function () {
            handleRgChange("first", "rg");
        });
    }
});

//document.getElementById("rg_event").addEventListener("change", function () {
//    handleRgChange("first_event","rg_event");
//});
document.addEventListener('DOMContentLoaded', function () {
    var rgEventElement = document.getElementById('rg_event');

    if (rgEventElement) {
        rgEventElement.addEventListener('change', function () {
            handleRgChange('first_event', 'rg_event');
        });
    }
});

// 第一層
function updateFirst(selectedYear,first, callback) {
    // 獲取CSV文件名
    const csvFileName = "select/addr1.csv";

    // 使用fetch獲取CSV文件
    fetch(csvFileName, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8'
        }
    })
    .then(response => response.text())
    .then(csvData => {
        // 將CSV數據轉換為JavaScript對象數組
        const data = parseCSV(csvData);

        // 過濾CSV數據，僅保留年號為選擇年號的數據
        const filteredData = data.filter(item => item["年號"] == selectedYear);

        // 獲取first的元素
        const firstElement = document.getElementById(first);

        // 清空下拉選單的內容
        firstElement.innerHTML = '';

        if (filteredData.length === 0) {
            console.error(`找不到與 ${selectedYear} 相符的數據。`);
            return;
        }

        // 使用Set來儲存級別，避免重複
        const levels = new Set();

        // 將數據添加到Set中
        filteredData.forEach(item => {
            levels.add(item["級別"]);
        });

        // 將Set中的元素添加到下拉選單中
        const sortedLevels = Array.from(levels).sort(); // 轉換並排序
        sortedLevels.forEach(level => {
            const option = document.createElement("option");
            option.value = level; // 選項value等於級別

            // 改選項文字
            switch (level) {
                case "1":
                    option.text = level+" 州";
                    break;
                case "2":
                    option.text = level+" 廳";
                    break;
                case "3":
                    option.text = level+" 其他";
                    break;
                default:
                    option.text = level; // 如果没有匹配到上述情况，仍然使用原始的級別值
                    break;
            }

            firstElement.add(option);
        });

        // 將選中索引設為 -1 預設選項空白
        firstElement.selectedIndex = -1;

        // 如果有回調函數，則調用它
        if (typeof callback === 'function') {
            callback();
        }

    })
    .catch(error => console.error(`發生錯誤（${csvFileName}):`, error));
}

// 當first或first_event選項改變時觸發的函數
function handleFirstDropdownChange(first_all,first,rg) {
    // 獲取選中的級別
    //const selectedLevel = event.target.value;
    const selectedLevel = document.getElementById(first).value;


    // 調用函數來更新first_all
    updateFirstAll(selectedLevel,first_all,rg);
    
}

// 將相同的更新邏輯應用於兩個下拉選單
//document.getElementById("first").addEventListener("change", function () {
//    handleFirstDropdownChange("first_all","first","rg");
//});
document.addEventListener("DOMContentLoaded", function() {
    const firstElement = document.getElementById("first");

    // 檢查元素是否存在
    if (firstElement) {
        firstElement.addEventListener("change", function () {
            handleFirstDropdownChange("first_all", "first", "rg");
        });
    }
});

//document.getElementById("first_event").addEventListener("change", function () {
//    handleFirstDropdownChange("first_all_event","first_event","rg_event");
//});
document.addEventListener('DOMContentLoaded', function () {
    var firstEventElement = document.getElementById('first_event');

    if (firstEventElement) {
        firstEventElement.addEventListener('change', function () {
            handleFirstDropdownChange('first_all_event', 'first_event', 'rg_event');
        });
    }
});

// 更新first_all的函數
function updateFirstAll(selectedLevel,first_all,rg, callback) {
    
    // 獲取CSV文件名
    const csvFileName = "select/addr1.csv";

    // 獲取選中的年號
    const selectedYearText = document.getElementById(rg).value;
    const selectedYear = selectedYearText.match(/\d+/)[0];

    // 使用fetch獲取CSV文件
    fetch(csvFileName, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8'
        }
    })
    .then(response => response.text())
    .then(csvData => {
        // 將CSV數據轉換為JavaScript對象數組
        const data = parseCSV(csvData);

        // 過濾CSV數據，僅保留年號和級別與選擇相符的數據
        const filteredData = data.filter(item => item["年號"] == selectedYear && item["級別"] == selectedLevel);

        // 獲取first_all的元素
        const firstAllElement = document.getElementById(first_all);

        // 清空下拉選單的內容
        firstAllElement.innerHTML = '';

        // 錯誤訊息
        if (filteredData.length === 0) {
            console.error(`找不到與年號 ${selectedYear} 和級別 ${selectedLevel} 相符的數據。`);
            return;
        }

        // 使用Set來儲存地名，避免重複
        const locations = new Set();

        // 將數據添加到Set中
        filteredData.forEach(item => {
            const codeKey = Object.keys(item).find(key => key.trim() === "代碼");// Object.keys(item) 來查看實際鍵名 直接打'代碼'會失效
            const code = (item[codeKey] || "").trim(); // 使用 trim() 去除多余的空白字符
            
            locations.add({
                code: code, //代碼
                name: item["地名"],
                identify:item["識別碼"]
            });
        });

        // 將 Set 轉換為陣列並按照 location.code 的順序排序
        const locationsArray = Array.from(locations).sort((a, b) => a.code - b.code);

        // 將陣列中的元素按照順序添加到下拉選單中
        locationsArray.forEach(location => {
            const option = document.createElement("option");
            option.value = location.identify; // 選項 value 等於識別碼

            // 改選項文字
            switch (selectedLevel) {
                case "1":
                    option.text = location.code + ' ' + location.name + "州";
                    break;
                case "2":
                    option.text = location.code + ' ' + location.name + "廳";
                    break;
                case "3":
                    option.text = location.code + ' ' + location.name;
                    break;
                default:
                    option.text = location.code + ' ' + location.name; 
                    break;
            }

            firstAllElement.add(option);
        });

        // 將選中索引設為 -1 預設選項空白
        firstAllElement.selectedIndex = -1;

        // 如果有回調函數，則調用它
        if (typeof callback === 'function') {
            callback();
        }

    })
    .catch(error => console.error(`發生錯誤（${csvFileName}):`, error));
}



// 第二層
function handleRgChange2(first_all,second) {
    // 獲取選中的地名代碼
    const selectedLocationCode = document.getElementById(first_all).value;

    // 調用函數來更新second
    updateSecond(selectedLocationCode,second);
}

// 調用函數
//document.getElementById("first_all").addEventListener("change", function () {
//    handleRgChange2("first_all","second");
//});
document.addEventListener("DOMContentLoaded", function() {
    const firstAllElement = document.getElementById("first_all");

    // 檢查元素是否存在
    if (firstAllElement) {
        firstAllElement.addEventListener("change", function() {
            handleRgChange2("first_all", "second");
        });
    }
});

//document.getElementById("first_all_event").addEventListener("change", function () {
//    handleRgChange2("first_all_event","second_event");
//});
document.addEventListener('DOMContentLoaded', function () {
    var firstAllEventElement = document.getElementById('first_all_event');

    if (firstAllEventElement) {
        firstAllEventElement.addEventListener('change', function () {
            handleRgChange2('first_all_event', 'second_event');
        });
    }
});


// 更新second的函數
function updateSecond(selectedLocationCode,second,callback) {
    // 獲取CSV文件名
    const csvFileName = "select/addr2.csv";

    // 使用fetch獲取CSV文件
    fetch(csvFileName, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8'
        }
    })
    .then(response => response.text())
    .then(csvData => {
        // 將CSV數據轉換為JavaScript對象數組
        const data = parseCSV(csvData);

        // 過濾CSV數據，僅保留上層識別碼為選中地區代碼的數據
        const filteredData = data.filter(item => item["上層識別碼"] == selectedLocationCode);

        // 獲取second的元素
        const secondElement = document.getElementById(second);

        // 清空下拉選單的內容
        secondElement.innerHTML = '';

        // 錯誤訊息
        if (filteredData.length === 0) {
            console.error(`找不到與上層識別碼 ${selectedLocationCode} 相符的數據。`);
            return;
        }

        // 使用Set來儲存級別，避免重複
        const levels = new Set();

        // 將級別添加到Set中
        filteredData.forEach(item => {
            levels.add(item["級別"]);
        });

        // 將Set中的元素添加到下拉選單中
        const sortedLevels = Array.from(levels).sort(); // 轉換並排序
        sortedLevels.forEach(level => {
            const option = document.createElement("option");
            option.value = level; // 選項value等於級別

            // 改選項文字
            switch (level) {
                case "1":
                    option.text = level+" 郡";
                    break;
                case "2":
                    option.text = level+" 堡";
                    break;
                case "3":
                    option.text = level+" 市";
                    break;
                case "5":
                    option.text = level+" 鄉";
                    break;
                case "6":
                    option.text = level+" 里";
                    break;
                case "7":
                    option.text = level+" 澳";
                    break;
                case "9":
                    option.text = level+" 其他";
                    break;
                default:
                    option.text = level; // 如果没有匹配到上述情况，仍然使用原始的級別值
                    break;
            }

            secondElement.add(option);
        });

        // 將選中索引設為 -1 預設選項空白
        secondElement.selectedIndex = -1;

        // 如果有回調函數，則調用它
        if (typeof callback === 'function') {
            callback();
        }
    })
    .catch(error => console.error(`發生錯誤（${csvFileName}):`, error));
}

// 當second選項改變時觸發的函數
function handleFirstDropdownChange2(second,first_all,second_all) {
    // 獲取選中的級別
    const selectedLevel2= document.getElementById(second).value;

    // 調用函數來更新second_all
    updateSecondAll(selectedLevel2,first_all,second_all);
    
}

// 將相同的更新邏輯應用於兩個下拉選單
//document.getElementById("second").addEventListener("change", function () {
//    handleFirstDropdownChange2("second","first_all","second_all");
//});
document.addEventListener("DOMContentLoaded", function() {
    const secondElement = document.getElementById("second");

    // 檢查元素是否存在
    if (secondElement) {
        secondElement.addEventListener("change", function() {
            handleFirstDropdownChange2("second", "first_all", "second_all");
        });
    }
});

//document.getElementById("second_event").addEventListener("change", function () {
//    handleFirstDropdownChange2("second_event","first_all_event","second_all_event");
//});
document.addEventListener('DOMContentLoaded', function () {
    var secondEventElement = document.getElementById('second_event');

    if (secondEventElement) {
        secondEventElement.addEventListener('change', function () {
            handleFirstDropdownChange2('second_event', 'first_all_event', 'second_all_event');
        });
    }
});


// 更新second_all的函數
function updateSecondAll(selectedLevel2,first_all,second_all,callback) {
    // 獲取CSV文件名
    const csvFileName = "select/addr2.csv";

    const identifier = document.getElementById(first_all).value;

    // 使用fetch獲取CSV文件
    fetch(csvFileName, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8'
        }
    })
    .then(response => response.text())
    .then(csvData => {
        // 將CSV數據轉換為JavaScript對象數組
        const data = parseCSV(csvData);

        // 過濾CSV數據，僅保留上層識別碼為選中地區代碼且級別與上層地區相同的數據
        const filteredData = data.filter(item => item["上層識別碼"] == identifier &&  item["級別"] == selectedLevel2);

        // 獲取second_all的元素
        const secondAllElement = document.getElementById(second_all);

        // 清空下拉選單的內容
        secondAllElement.innerHTML = '';

        //錯誤訊息
        if (filteredData.length === 0) {
            console.error(`找不到與上層識別碼 ${identifier} 相符的數據。`);
            return;
        }


        // 使用Set來儲存地名，避免重複
        const locations = new Set();

        // 將數據添加到Set中
        filteredData.forEach(item => {
            const codeKey = Object.keys(item).find(key => key.trim() === "代碼");
            const code = (item[codeKey] || "").trim(); 

            locations.add({
                code: code,
                name: item["地名"],
                identify:item["識別碼"]
            });
        });

        // 將 Set 轉換為陣列並按照 location.code 的順序排序
        const locationsArray = Array.from(locations).sort((a, b) => a.code - b.code);

        // 將陣列中的元素按照順序添加到下拉選單中
        locationsArray.forEach(location => {
            const option = document.createElement("option");
            option.value = location.identify; // 選項 value 等於代碼

            // 改選項文字
            switch (selectedLevel2) {
                case "1":
                    option.text = location.code + ' ' + location.name + "郡";
                    break;
                case "2":
                    option.text = location.code + ' ' + location.name + "堡";
                    break;
                case "3":
                    option.text = location.code + ' ' + location.name + "市";
                    break;
                case "5":
                    option.text = location.code + ' ' + location.name + "鄉";
                    break;
                case "6":
                    option.text = location.code + ' ' + location.name + "里";
                    break;
                case "7":
                    option.text = location.code + ' ' + location.name + "澳";
                    break;
                case "9":
                    option.text = location.code + ' ' + location.name;
                    break;
                default:
                    option.text = location.code + ' ' + location.name; 
                    break;
            }

            secondAllElement.add(option);
        });

        // 將選中索引設為 -1 預設選項空白
        secondAllElement.selectedIndex = -1;

        // 如果有回調函數，則調用它
        if (typeof callback === 'function') {
            callback();
        }
    })
    .catch(error => console.error(`發生錯誤（${csvFileName}):`, error));
}

// 第三層
function handleRgChange3(second_all,third) {
    // 獲取選中的地名代碼
    const selectedLocationCode2 = document.getElementById(second_all).value;

    // 調用函數來更新third
    updatethird(selectedLocationCode2,third);
}

// 調用函數
//document.getElementById("second_all").addEventListener("change", function () {
//    handleRgChange3("second_all","third");
//});
document.addEventListener("DOMContentLoaded", function() {
    const secondAllElement = document.getElementById("second_all");

    // 檢查元素是否存在
    if (secondAllElement) {
        secondAllElement.addEventListener("change", function() {
            handleRgChange3("second_all", "third");
        });
    }
});

// 調用函數
//document.getElementById("second_all_event").addEventListener("change", function () {
//    handleRgChange3("second_all_event","third_event");
//});
document.addEventListener('DOMContentLoaded', function () {
    var secondAllEventElement = document.getElementById('second_all_event');

    if (secondAllEventElement) {
        secondAllEventElement.addEventListener('change', function () {
            handleRgChange3('second_all_event', 'third_event');
        });
    }
});

// 更新third的函數
function updatethird(selectedLocationCode2,third,callback) {
    // 獲取CSV文件名
    const csvFileName = "select/addr3.csv";

    // 使用fetch獲取CSV文件
    fetch(csvFileName, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8'
        }
    })
    .then(response => response.text())
    .then(csvData => {
        // 將CSV數據轉換為JavaScript對象數組
        const data = parseCSV(csvData);

        // 過濾CSV數據，僅保留上層識別碼為選中地區代碼的數據
        const filteredData = data.filter(item => item["上層識別碼"] == selectedLocationCode2);

        // 獲取third的元素
        const thirdElement = document.getElementById(third);

        // 清空下拉選單的內容
        thirdElement.innerHTML = '';

        //錯誤訊息
        if (filteredData.length === 0) {
            console.error(`找不到與上層識別碼 ${selectedLocationCode2} 相符的數據。`);
            return;
        }

        // 使用Set來儲存級別，避免重複
        const levels = new Set();

        // 將級別添加到Set中
        filteredData.forEach(item => {
            levels.add(item["級別"]);
        });

        // 將Set中的元素添加到下拉選單中
        const sortedLevels = Array.from(levels).sort(); // 轉換並排序
        sortedLevels.forEach(level => {
            const option = document.createElement("option");
            option.value = level; // 選項value等於級別

            // 改選項文字
            switch (level) {
                case "1":
                    option.text = level+" 街";
                    break;
                case "2":
                    option.text = level+" 庄";
                    break;
                case "3":
                    option.text = level+" 鄉";
                    break;
                case "4":
                    option.text = level+" 村";
                    break;
                case "5":
                    option.text = level+" 社";
                    break;
                case "6":
                    option.text = level+" 區";
                    break;
                case "7":
                    option.text = level+" 市";
                    break;
                case "8":
                    option.text = level+" 其他";
                    break;
                default:
                    option.text = level; // 如果没有匹配到上述情况，仍然使用原始的級別值
                    break;
            }

            thirdElement.add(option);
        });

        // 將選中索引設為 -1 預設選項空白
        thirdElement.selectedIndex = -1;

        // 如果有回調函數，則調用它
        if (typeof callback === 'function') {
            callback();
        }
    })
    .catch(error => console.error(`發生錯誤（${csvFileName}):`, error));
}

// 當third選項改變時觸發的函數
function handleFirstDropdownChange3(third,second_all,third_all) {
    // 獲取選中的級別
    const selectedLevel3= document.getElementById(third).value;

    // 調用函數來更新third_all
    updatethirdAll(selectedLevel3,second_all,third_all);
    
}

// 將相同的更新邏輯應用於兩個下拉選單
//document.getElementById("third").addEventListener("change", function () {
//    handleFirstDropdownChange3("third","second_all","third_all");
//});
document.addEventListener("DOMContentLoaded", function() {
    const thirdElement = document.getElementById("third");

    // 檢查元素是否存在
    if (thirdElement) {
        thirdElement.addEventListener("change", function() {
            handleFirstDropdownChange3("third", "second_all", "third_all");
        });
    }
});
//document.getElementById("third_event").addEventListener("change", function () {
//    handleFirstDropdownChange3("third_event","second_all_event","third_all_event");
//});
document.addEventListener('DOMContentLoaded', function () {
    var thirdEventElement = document.getElementById('third_event');

    if (thirdEventElement) {
        thirdEventElement.addEventListener('change', function () {
            handleFirstDropdownChange3('third_event', 'second_all_event', 'third_all_event');
        });
    }
});

// 更新second_all的函數
function updatethirdAll(selectedLevel3,second_all,third_all,callback) {
    // 獲取CSV文件名
    const csvFileName = "select/addr3.csv";

    const identifier2 = document.getElementById(second_all).value;

    // 使用fetch獲取CSV文件
    fetch(csvFileName, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8'
        }
    })
    .then(response => response.text())
    .then(csvData => {
        // 將CSV數據轉換為JavaScript對象數組
        const data = parseCSV(csvData);

        // 過濾CSV數據，僅保留上層識別碼為選中地區代碼且級別與上層地區相同的數據
        const filteredData = data.filter(item => item["上層識別碼"] == identifier2 &&  item["級別"] == selectedLevel3);

        // 獲取third_all的元素
        const thirdAllElement = document.getElementById(third_all);

        // 清空下拉選單的內容
        thirdAllElement.innerHTML = '';

        //錯誤訊息
        if (filteredData.length === 0) {
            console.error(`找不到與上層識別碼 ${identifier2} 相符的數據。`);
            return;
        }

        // 使用Set來儲存地名，避免重複
        const locations = new Set();

        // 將數據添加到Set中
        filteredData.forEach(item => {
            const codeKey = Object.keys(item).find(key => key.trim() === "代碼");
            const code = (item[codeKey] || "").trim(); 

            locations.add({
                code: code,
                name: item["地名"],
                identify:item["識別碼"]
            });
        });

        // 將 Set 轉換為陣列並按照 location.code 的順序排序
        const locationsArray = Array.from(locations).sort((a, b) => a.code - b.code);

        // 將陣列中的元素按照順序添加到下拉選單中
        locationsArray.forEach(location => {
            const option = document.createElement("option");
            option.value = location.identify; // 選項 value 等於代碼

            // 改選項文字
            switch (selectedLevel3) {
                case "1":
                    option.text = location.code + ' ' + location.name + "街";
                    break;
                case "2":
                    option.text = location.code + ' ' + location.name + "庄";
                    break;
                case "3":
                    option.text = location.code + ' ' + location.name + "鄉";
                    break;
                case "4":
                    option.text = location.code + ' ' + location.name + "村";
                    break;
                case "5":
                    option.text = location.code + ' ' + location.name + "社";
                    break;
                case "6":
                    option.text = location.code + ' ' + location.name + "區";
                    break;
                case "7":
                    option.text = location.code + ' ' + location.name + "市";
                    break;
                case "8":
                    option.text = location.code + ' ' + location.name;
                    break;
                default:
                    option.text = location.code + ' ' + location.name; 
                    break;
            }

            thirdAllElement.add(option);
        });

        // 將選中索引設為 -1 預設選項空白
        thirdAllElement.selectedIndex = -1;

        // 如果有回調函數，則調用它
        if (typeof callback === 'function') {
            callback();
        }
    })
    .catch(error => console.error(`發生錯誤（${csvFileName}):`, error));
}

// 第四層
function handleRgChange4(third_all,fourth) {
    // 獲取選中的地名代碼
    const selectedLocationCode3 = document.getElementById(third_all).value;

    // 調用函數來更新fourth
    updatefourth(selectedLocationCode3,fourth);
}

// 調用函數
//document.getElementById("third_all").addEventListener("change", function () {
//    handleRgChange4("third_all","fourth");
//});
document.addEventListener("DOMContentLoaded", function() {
    const thirdAllElement = document.getElementById("third_all");

    // 檢查元素是否存在
    if (thirdAllElement) {
        thirdAllElement.addEventListener("change", function() {
            handleRgChange4("third_all", "fourth");
        });
    }
});
//document.getElementById("third_all_event").addEventListener("change", function () {
//    handleRgChange4("third_all_event","fourth_event");
//});
document.addEventListener('DOMContentLoaded', function () {
    var thirdAllEventElement = document.getElementById('third_all_event');

    if (thirdAllEventElement) {
        thirdAllEventElement.addEventListener('change', function () {
            handleRgChange4('third_all_event', 'fourth_event');
        });
    }
});

// 更新fourth的函數
function updatefourth(selectedLocationCode3,fourth,callback) {
    // 獲取CSV文件名
    const csvFileName = "select/addr4.csv";

    // 使用fetch獲取CSV文件
    fetch(csvFileName, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8'
        }
    })
    .then(response => response.text())
    .then(csvData => {
        // 將CSV數據轉換為JavaScript對象數組
        const data = parseCSV(csvData);

        // 過濾CSV數據，僅保留上層識別碼為選中地區代碼的數據
        const filteredData = data.filter(item => item["上層識別碼"] == selectedLocationCode3);

        // 獲取fourth的元素
        const fourthElement = document.getElementById(fourth);

        // 清空下拉選單的內容
        fourthElement.innerHTML = '';

        // 錯誤訊息
        if (filteredData.length === 0) {
            console.error(`找不到與上層識別碼 ${selectedLocationCode} 相符的數據。`);
            return;
        }

        // 使用Set來儲存級別，避免重複
        const levels = new Set();

        // 將級別添加到Set中
        filteredData.forEach(item => {
            levels.add(item["級別"]);
        });

        // 將Set中的元素添加到下拉選單中
        const sortedLevels = Array.from(levels).sort(); // 轉換並排序
        sortedLevels.forEach(level => {
            const option = document.createElement("option");
            option.value = level; // 選項value等於級別

            // 改選項文字
            switch (level) {
                case "1":
                    option.text = level+" 大字";
                    break;
                case "2":
                    option.text = level+" 土名";
                    break;
                default:
                    option.text = level; // 如果没有匹配到上述情况，仍然使用原始的級別值
                    break;
            }

            fourthElement.add(option);
        });

        // 將選中索引設為 -1 預設選項空白
        fourthElement.selectedIndex = -1;

        // 如果有回調函數，則調用它
        if (typeof callback === 'function') {
            callback();
        }

    })
    .catch(error => console.error(`發生錯誤（${csvFileName}):`, error));
}

// 當fourth選項改變時觸發的函數
function handleFirstDropdownChange4(fourth,third_all,fourth_all) {
    // 獲取選中的級別
    const selectedLevel4= document.getElementById(fourth).value;

    // 調用函數來更新fourth_all
    updatefourthAll(selectedLevel4,third_all,fourth_all);
    
}

// 將相同的更新邏輯應用於兩個下拉選單
//document.getElementById("fourth").addEventListener("change", function () {
//    handleFirstDropdownChange4("fourth","third_all","fourth_all");
//});
document.addEventListener("DOMContentLoaded", function() {
    const fourthElement = document.getElementById("fourth");

    // 檢查元素是否存在
    if (fourthElement) {
        fourthElement.addEventListener("change", function() {
            handleFirstDropdownChange4("fourth", "third_all", "fourth_all");
        });
    }
});
//document.getElementById("fourth_event").addEventListener("change", function () {
//    handleFirstDropdownChange4("fourth_event","third_all_event","fourth_all_event");
//});
document.addEventListener('DOMContentLoaded', function () {
    var fourthEventElement = document.getElementById('fourth_event');

    if (fourthEventElement) {
        fourthEventElement.addEventListener('change', function () {
            handleFirstDropdownChange4('fourth_event', 'third_all_event', 'fourth_all_event');
        });
    }
});

// 更新fourth_all的函數
function updatefourthAll(selectedLevel4,third_all,fourth_all,callback) {
    // 獲取CSV文件名
    const csvFileName = "select/addr4.csv";

    const identifier3 = document.getElementById(third_all).value;

    // 使用fetch獲取CSV文件
    fetch(csvFileName, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8'
        }
    })
    .then(response => response.text())
    .then(csvData => {
        // 將CSV數據轉換為JavaScript對象數組
        const data = parseCSV(csvData);

        // 過濾CSV數據，僅保留上層識別碼為選中地區代碼且級別與上層地區相同的數據
        const filteredData = data.filter(item => item["上層識別碼"] == identifier3 &&  item["級別"] == selectedLevel4);

        // 獲取fourth_all的元素
        const fourthAllElement = document.getElementById(fourth_all);

        // 清空下拉選單的內容
        fourthAllElement.innerHTML = '';

        // 添加固定選項 "0 無值"
        const optionNone = document.createElement("option");
        optionNone.value = "0";
        optionNone.text = "0 無值";
        fourthAllElement.add(optionNone);

        // 添加固定選項 "-1 不確定"
        const optionUncertain = document.createElement("option");
        optionUncertain.value = "-1";
        optionUncertain.text = "-1 不確定";
        fourthAllElement.add(optionUncertain);

        if (identifier3 !== "0" && identifier3 !== "-1") {
            // 如果級別是0或-1就不會出現錯誤訊息
            if (filteredData.length === 0) {
                console.error(`找不到與上層識別碼 ${identifier3} 相符的數據。`);
                return;
            }
        }

        // 使用Set來儲存地名，避免重複
        const locations = new Set();

        // 將數據添加到Set中
        filteredData.forEach(item => {
            const codeKey = Object.keys(item).find(key => key.trim() === "代碼");
            const code = (item[codeKey] || "").trim(); 

            locations.add({
                code: code,
                name: item["地名"],
                identify:item["識別碼"]
            });
        });

        // 將 Set 轉換為陣列並按照 location.code 的順序排序
        const locationsArray = Array.from(locations).sort((a, b) => a.code - b.code);

        // 將陣列中的元素按照順序添加到下拉選單中
        locationsArray.forEach(location => {
            const option = document.createElement("option");
            option.value = location.identify; // 選項 value 等於代碼

            // 改選項文字
            switch (selectedLevel4) {
                case "1":
                    option.text = location.code + ' ' + location.name+'大字';
                    break;
                case "2":
                    option.text = location.code + ' ' + location.name+'土名';
                    break;
                default:
                    option.text = location.code + ' ' + location.name; 
                    break;
            }

            fourthAllElement.add(option);
        });

        // 將選中索引設為 -1 預設選項空白
        fourthAllElement.selectedIndex = -1;

        // 如果有回調函數，則調用它
        if (typeof callback === 'function') {
            callback();
        }
    })
    .catch(error => console.error(`發生錯誤（${csvFileName}):`, error));
}


// 解析CSV數據為JavaScript對象數組的函數
function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split('\t');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split('\t');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
        }

        result.push(obj);
    }

    return result;
}

//輸入搜尋
function filterOptions(selectId, searchInputId) {
    // 獲取輸入框的值
    var input = document.getElementById(searchInputId).value.toUpperCase();

    // 獲取下拉選單
    var select = document.getElementById(selectId);

    // 獲取所有選項
    var options = select.getElementsByTagName("option");

    // 遍歷選項，顯示匹配的選項，隱藏不匹配的選項
    for (var i = 0; i < options.length; i++) {
        var textValue = options[i].textContent || options[i].innerText;
        if (textValue.toUpperCase().indexOf(input) > -1) {
            options[i].style.display = "";
        } else {
            options[i].style.display = "none";
        }
    }
}

// 取得戶冊表單元素
document.addEventListener("DOMContentLoaded", function() {
    const formElement = document.getElementById('householdForm');
    
    if (formElement) {
        formElement.addEventListener('submit', function(e) {
            e.preventDefault();

            var id = document.getElementById('id').value; // 戶號
            var slashInput = document.querySelector('input[name="slash"]:checked');// 斜線
            if (slashInput) {
                var slash = slashInput.value; 
            } else {
                var slash = ""; 
            }
            var typeInput = document.querySelector('input[name="type"]:checked');// 戶冊別
            if (typeInput) {
                var type = typeInput.value; 
            } else {
                var type = ""; 
            }


            var rg = document.getElementById('rg').value;  // 年號
            var rg_ch = ""; // 年號的文字
            if (rg){
                rg_ch = document.getElementById('rg').options[document.getElementById('rg').selectedIndex].text;
            }
            
            var first = document.getElementById('first').value;  // 1
            var first_ch = "";
            if (first){
                first_ch = document.getElementById('first').options[document.getElementById('first').selectedIndex].text;  // 第一層級別
            }
            var first_all_ch= "";
            if (document.getElementById('first_all').value){
                first_all_ch = document.getElementById('first_all').options[document.getElementById('first_all').selectedIndex].text; //第一層地名跟代碼
            }

            var second = document.getElementById('second').value;  // 2
            var second_ch = "";
            if (second){
                second_ch = document.getElementById('second').options[document.getElementById('second').selectedIndex].text;  // 第二層級別
            }
            var second_all_ch= "";
            if (document.getElementById('second_all').value){
                second_all_ch = document.getElementById('second_all').options[document.getElementById('second_all').selectedIndex].text; //第二層地名跟代碼
            }  

            var third = document.getElementById('third').value;  // 3
            var third_ch = "";
            if (third){
                third_ch = document.getElementById('third').options[document.getElementById('third').selectedIndex].text;  // 第三層級別
            }
            var third_all_ch= "";
            if (document.getElementById('third_all').value){
                third_all_ch = document.getElementById('third_all').options[document.getElementById('third_all').selectedIndex].text; //第三層地名跟代碼
            }  

            var fourth = document.getElementById('fourth').value;  // 4
            var fourth_ch = "";
            if (fourth){
                fourth_ch = document.getElementById('fourth').options[document.getElementById('fourth').selectedIndex].text;   // 第四層級別
            }
            var fourth_all_ch= "";
            if (document.getElementById('fourth_all').value){
                fourth_all_ch = document.getElementById('fourth_all').options[document.getElementById('fourth_all').selectedIndex].text; //第四層地名跟代碼
            }  

            var chome = document.getElementById('chome').value;  // 丁目
            var address = document.getElementById('address').value;  // 番地
            var of1 = document.getElementById('of1').value;  // 幾之
            var of2 = document.getElementById('of2').value;  // 幾

            var reviseInput = document.querySelector('input[name="revise"]:checked');// 是否修改
            if (reviseInput) {
                var revise = reviseInput.value; 
            } else {
                var revise = ""; 
            }

            var origin_address = document.getElementById('origin_address').value; // 本國住所
            var o_add_no_checkbox = document.getElementById('o_add_no'); // 無此欄位=1
            var o_add_no_checkboxValue = o_add_no_checkbox.checked ? 1 : 0;

            var clan_name = document.getElementById('clan_name').value; // 族稱
            var c_name_no_checkbox = document.getElementById('c_name_no'); // 無此欄位=1
            var c_name_no_checkboxValue = c_name_no_checkbox.checked ? 1 : 0;

            var rg2 = document.getElementById('rg2').value;  // 年號2
            var rg2_ch = "";
            if (rg2){
                rg2_ch= document.getElementById('rg2').options[document.getElementById('rg2').selectedIndex].text; // 年號的文字
            }

            var yy2 = document.getElementById('yy2').value; //年2
            var mm2 = document.getElementById('mm2').value; //月2
            var dd2 = document.getElementById('dd2').value; //日2

            var reason = document.getElementById('reason').value;  // 開戶原由
            var reason_ch = "";
            if (reason){
                reason_ch = document.getElementById('reason').options[document.getElementById('reason').selectedIndex].text;  // 戶主事由的文字
            }
            var ex_reason = document.getElementById('ex_reason').value;  // 前戶主退由
            var ex_reason_ch = "";
            if (ex_reason){
                ex_reason_ch = document.getElementById('ex_reason').options[document.getElementById('ex_reason').selectedIndex].text;  // 前戶主事由的文字
            }
            var o_name = document.getElementById('o_name').value; //戶主
            var o_yy2 = document.getElementById('o_yy2').value; //年
            var o_mm2 = document.getElementById('o_mm2').value; //月
            var o_dd2 = document.getElementById('o_dd2').value; //日

            var ex_name = document.getElementById('ex_name').value; //前戶主
            var ex_relationship = document.getElementById('ex_relationshipInput').value; // 前戶主續柄
            var ex_relationship_ch = ""; 
            if (ex_relationship){
                ex_relationship_ch = document.getElementById('ex_relationshipInput').options[document.getElementById('ex_relationshipInput').selectedIndex].text; // 前戶主續柄的文字
            }

            var job3 = document.getElementById('job3').value; //前戶主職業
            var job3_ch = ""; 
            if (job3){
                job3_ch = document.getElementById('job3').options[document.getElementById('job3').selectedIndex].text; // 職業的文字
            }
            
            // 發送POST請求到指定的路徑'/generate-householdForm-csv'
            fetch('/generate-householdForm-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // 指定請求的內容類型為JSON
                },
                body: JSON.stringify({id:id,slash:slash,type:type,
                    rg:rg,rg_ch:rg_ch,first:first,first_ch:first_ch, first_all_ch:first_all_ch,
                    second:second,second_ch:second_ch,second_all_ch:second_all_ch,
                    third:third,third_ch:third_ch,third_all_ch:third_all_ch,
                    fourth:fourth,fourth_ch:fourth_ch,fourth_all_ch:fourth_all_ch,
                    chome:chome,address:address,of1:of1,of2:of2,
                    revise:revise,
                    origin_address:origin_address,o_add_no_checkboxValue:o_add_no_checkboxValue,
                    clan_name:clan_name,c_name_no_checkboxValue:c_name_no_checkboxValue,
                    rg2:rg2,rg2_ch:rg2_ch,yy2:yy2,mm2:mm2,dd2:dd2,
                    reason:reason,reason_ch:reason_ch,ex_reason:ex_reason,ex_reason_ch:ex_reason_ch,
                    o_name:o_name,o_yy2:o_yy2,o_mm2:o_mm2,o_dd2:o_dd2,
                    ex_name:ex_name,ex_relationship:ex_relationship,ex_relationship_ch:ex_relationship_ch,job3:job3,job3_ch:job3_ch}), // 將輸入的數字轉換為JSON格式並作為請求體發送
            })
            .then(response => response.json()) // 解析回應的JSON數據
            .then(data => {
                alert('戶冊新建成功!'); // 在產生CSV成功時彈出提示

                // 清除輸入框的值
                document.getElementById('id').value = '';
                var slashRadioButtons = document.querySelectorAll('input[name="slash"]');
                slashRadioButtons.forEach(function(radio) {
                    radio.checked = false;
                });
                var typeRadioButtons = document.querySelectorAll('input[name="type"]');
                typeRadioButtons.forEach(function(radio) {
                    radio.checked = false;
                });
                document.getElementById('rg').value= '';
                document.getElementById('first').value= '';
                document.getElementById('first_all').value= '';
                document.getElementById('second').value= '';
                document.getElementById('second_all').value= '';
                document.getElementById('third').value= '';
                document.getElementById('third_all').value= '';
                document.getElementById('fourth').value= '';
                document.getElementById('fourth_all').value= '';
                document.getElementById('chome').value= '';
                document.getElementById('address').value= '';
                document.getElementById('of1').value= '';
                document.getElementById('of2').value= '';
                var reviseRadioButtons = document.querySelectorAll('input[name="revise"]');
                reviseRadioButtons.forEach(function(radio) {
                    radio.checked = false;
                });
                document.getElementById('origin_address').value= '';
                document.getElementById('o_add_no').checked = false; // 清除复选框状态
                document.getElementById('o_add_no').value = '0'; // 恢复默认值
                document.getElementById('clan_name').value= '';
                document.getElementById('c_name_no').checked = false; // 清除复选框状态
                document.getElementById('c_name_no').value = '0'; // 恢复默认值
                document.getElementById('rg2').value= '';
                document.getElementById('yy2').value= '';
                document.getElementById('mm2').value= '';
                document.getElementById('dd2').value= '';
                document.getElementById('reason').value= '';
                document.getElementById('ex_reason').value= '';
                document.getElementById('o_name').value= '';
                document.getElementById('o_yy2').value= '';
                document.getElementById('o_mm2').value= '';
                document.getElementById('o_dd2').value= '';
                document.getElementById('ex_name').value= '';
                document.getElementById('ex_relationshipsearch').value= '';
                document.getElementById('ex_relationshipInput').value= '';
                document.getElementById('job3search').value = '';
                document.getElementById('job3').value = '';

            })
            .catch((error) => {
                console.error('Error:', error); //錯誤提醒
            });
        });
    }});

// 取得成員表單元素
//document.getElementById('memberForm').addEventListener('submit', function(e) {
    // 阻止表單預設提交行為
//    e.preventDefault();
document.addEventListener("DOMContentLoaded", function() {
    // 首先讀取CSV文件並獲取倒數第二行的戶號
    fetch('household.csv')
        .then(response => response.text())
        .then(csvData => {
            var data = parseCSV2(csvData); // 解析CSV數據
            if (data.length > 1) {
                var secondLastRow = data[data.length - 2]; // 獲取倒數第二行
                var householdNumber = secondLastRow[0]; // 假設戶號在第一列
                document.getElementById('id1').value = householdNumber; // 自動填入戶號
            }
        })
        .catch(error => {
            
        });

    const formElement = document.getElementById('memberForm');
    
    if (formElement) {
        formElement.addEventListener('submit', function(e) {
            e.preventDefault();

            var id1 = document.getElementById('id1').value; // 序號
            var perno = document.getElementById('perno').value; // 人號
            var slashInput2 = document.querySelector('input[name="slash2"]:checked');// 斜線
            if (slashInput2) {
                var slash2 = slashInput2.value; 
            } else {
                var slash2 = ""; 
            }

            var name = document.getElementById('nameInput').value; // 名字
            var name2 = document.getElementById('nameInput2').value; // 名字2
            var name3 = document.getElementById('nameInput3').value; // 名字3
            var name4 = document.getElementById('nameInput4').value; // 名字4
            var name5 = document.getElementById('nameInput5').value; // 名字5
            var reign = document.getElementById('reign').value;  // 年號
            var reign_ch = ""; 
            if (reign){
                reign_ch = document.getElementById('reign').options[document.getElementById('reign').selectedIndex].text; // 年號的文字
            }
            var yy = document.getElementById('yy').value; //年
            var mm = document.getElementById('mm').value; //月
            var dd = document.getElementById('dd').value; //日
            var genderInput = document.querySelector('input[name="gender"]:checked');// 性別
            if (genderInput) {
                var sex = genderInput.value; 
            } else {
                var sex = ""; 
            }
            var father = document.getElementById('father').value; //父
            var mother = document.getElementById('mother').value; //母
            var porder = document.getElementById('porder').value; //出生別
            var porder_ch = ""; 
            if (porder){
                porder_ch = document.getElementById('porder').options[document.getElementById('porder').selectedIndex].text; // 出生別的文字
            }
            var relationship = document.getElementById('relationshipInput').value; // 續柄
            var relationship_ch = ""; 
            if (relationship){
                relationship_ch = document.getElementById('relationshipInput').options[document.getElementById('relationshipInput').selectedIndex].text; // 續柄的文字
            }
            var job1 = document.getElementById('job1').value; //職業1
            var job1_ch = ""; 
            if (job1){
                job1_ch = document.getElementById('job1').options[document.getElementById('job1').selectedIndex].text; // 職業1的文字
            }
            var job2 = document.getElementById('job2').value; //職業2
            var job2_ch = ""; 
            if (job2){
                job2_ch = document.getElementById('job2').options[document.getElementById('job2').selectedIndex].text; // 職業2的文字
            }
            var race = document.getElementById('race').value; // 種族
            var race_ch = ""; 
            if (race){
                race_ch = document.getElementById('race').options[document.getElementById('race').selectedIndex].text; // 種族的文字
            }
            var opium = document.getElementById('opium').value; //鴉片
            var opium_ch = ""; 
            if (opium){
                opium_ch = document.getElementById('opium').options[document.getElementById('opium').selectedIndex].text; // 鴉片的文字
            }
            var foot_binding = document.getElementById('foot_binding').value; //纏足
            var foot_binding_ch = ""; 
            if (foot_binding){
                foot_binding_ch = document.getElementById('foot_binding').options[document.getElementById('foot_binding').selectedIndex].text; // 纏足的文字
            }
            var relevant_ysInput = document.querySelector('input[name="relevant_ys"]:checked');// 斜線
            if (relevant_ysInput) {
                var relevant_ys = relevant_ysInput.value; 
            } else {
                var relevant_ys = ""; 
            }
            var initial_relationship1 = document.getElementById('initial_relationship1').value; //初始關係1
            var initial_relationship1_ch = ""; 
            if (initial_relationship1){
                initial_relationship1_ch = document.getElementById('initial_relationship1').options[document.getElementById('initial_relationship1').selectedIndex].text; // 初始關係1的文字
            }
            var relevant_person1 = document.getElementById('relevant_person1').value; //關係人1
            var initial_relationship2 = document.getElementById('initial_relationship2').value; //初始關係2
            var initial_relationship2_ch = ""; 
            if (initial_relationship2){
                initial_relationship2_ch = document.getElementById('initial_relationship2').options[document.getElementById('initial_relationship2').selectedIndex].text; // 初始關係2的文字
            }
            var relevant_person2 = document.getElementById('relevant_person2').value; //關係人2
            
            // 發送POST請求到指定的路徑'/generate-csv'
            fetch('/generate-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // 指定請求的內容類型為JSON
                },
                body: JSON.stringify({ id1 : id1 ,perno:perno,slash2:slash2, name : name,name2:name2,name3:name3,name4:name4,name5:name5, reign : reign,reign_ch:reign_ch , yy : yy , mm : mm , dd : dd , 
                    sex : sex ,father:father,mother:mother,porder:porder,porder_ch:porder_ch,relationship:relationship,relationship_ch:relationship_ch,job1:job1,job1_ch:job1_ch,
                    job2:job2,job2_ch:job2_ch,race:race,race_ch:race_ch,opium:opium,opium_ch:opium_ch,foot_binding:foot_binding,foot_binding_ch:foot_binding_ch,
                    relevant_ys:relevant_ys,
                    initial_relationship1:initial_relationship1,initial_relationship1_ch:initial_relationship1_ch,relevant_person1:relevant_person1,initial_relationship2:initial_relationship2,initial_relationship2_ch:initial_relationship2_ch,relevant_person2:relevant_person2,}), // 將輸入的數字轉換為JSON格式並作為請求體發送
            })
            .then(response => response.json()) // 解析回應的JSON數據
            .then(data => {
                alert('成員新建成功!'); // 在產生CSV成功時彈出提示

                // 清除輸入框的值
                document.getElementById('id1').value = '';
                document.getElementById('perno').value = '';
                var slashRadioButtons2 = document.querySelectorAll('input[name="slash2"]');
                slashRadioButtons2.forEach(function(radio) {
                    radio.checked = false;
                });
                document.getElementById('nameInput').value = '';
                document.getElementById('nameInput2').value = '';
                document.getElementById('nameInput3').value = '';
                document.getElementById('nameInput4').value = '';
                document.getElementById('nameInput5').value = '';
                document.getElementById('reign').value = '';
                document.getElementById('yy').value = '';
                document.getElementById('mm').value = '';
                document.getElementById('dd').value = '';
                var genderRadioButtons = document.querySelectorAll('input[name="gender"]');
                genderRadioButtons.forEach(function(radio) {
                    radio.checked = false;
                });
                document.getElementById('father').value = '';
                document.getElementById('mother').value = '';
                document.getElementById('porder').value = '';
                document.getElementById('relationshipsearch').value = '';
                document.getElementById('relationshipInput').value = '';
                document.getElementById('job1search').value = '';
                document.getElementById('job1').value = '';
                document.getElementById('job2search').value = '';
                document.getElementById('job2').value = '';
                document.getElementById('race').value= ''; 
                document.getElementById('opium').value= ''; 
                document.getElementById('foot_binding').value= '';
                var relevant_ysRadioButtons = document.querySelectorAll('input[name="relevant_ys"]');
                relevant_ysRadioButtons.forEach(function(radio) {
                    radio.checked = false;
                });
                document.getElementById('initial_relationship1').value= ''; 
                document.getElementById('relevant_person1').value= ''; 
                document.getElementById('initial_relationship2').value= ''; 
                document.getElementById('relevant_person2').value= ''; 

                // 更改背景顏色為預設
                changeBackgroundColor('#b7b7a4');

            })
            .catch((error) => {
                console.error('Error:', error); //錯誤提醒
            });
        });
    }})

// 取得事件表單元素
//document.getElementById('eventForm').addEventListener('submit', function(e) {
    // 阻止表單預設提交行為
    //e.preventDefault();
document.addEventListener("DOMContentLoaded", function() {
    // 首先讀取CSV文件並獲取倒數第二行的戶號
    fetch('person.csv')
        .then(response => response.text())
        .then(csvData => {
            var data = parseCSV2(csvData); // 解析CSV數據
            if (data.length > 1) {
                var secondLastRow = data[data.length - 2]; // 獲取倒數第二行
                var householdNumber = secondLastRow[0]; // 戶號
                var personNumber = secondLastRow[1]; // 人號
                document.getElementById('id2').value = householdNumber; // 自動填入戶號
                document.getElementById('perno2').value = personNumber; // 自動填入人好
            }
        })
        .catch(error => {
            
        });
    const formElement = document.getElementById('eventForm');
    
    if (formElement) {
        formElement.addEventListener('submit', function(e) {
            e.preventDefault();

            var id2 = document.getElementById('id2').value; // 戶號
            var perno2 = document.getElementById('perno2').value; // 人號

            var rg3 = document.getElementById('rg3').value;  // 年號
            var rg3_ch = ""; 
            if (rg3){
                rg3_ch = document.getElementById('rg3').options[document.getElementById('rg3').selectedIndex].text; // 年號的文字
            }
            var yy3 = document.getElementById('yy3').value; //年
            var mm3 = document.getElementById('mm3').value; //月
            var dd3 = document.getElementById('dd3').value; //日
            var no3 = document.getElementById('no3').value; // 序號
            var event = document.getElementById('event').value; // 事件
            var event_ch = ""; 
            if (event){
                event_ch = document.getElementById('event').options[document.getElementById('event').selectedIndex].text; // 事件的文字
            }
            var relevant_person3 = document.getElementById('relevant_person3').value; // 關係人
            var type2Input = document.querySelector('input[name="type2"]:checked');// 本戶或他戶
            if (type2Input) {
                var type2 = type2Input.value; 
            } else {
                var type2 = ""; 
            }
            var relationInput = document.getElementById('relationInput').value; // 關係
            var relationInput_ch = ""; 
            if (relationInput){
                relationInput_ch = document.getElementById('relationInput').options[document.getElementById('relationInput').selectedIndex].text; // 關係的文字
            }

            var name2 = document.getElementById('name2').value; // 戶主
            var relationshipInput2 = document.getElementById('relationshipInput2').value; // 續柄
            var relationshipInput2_ch = ""; 
            if (relationshipInput2){
                relationshipInput2_ch = document.getElementById('relationshipInput2').options[document.getElementById('relationshipInput2').selectedIndex].text; // 續柄的文字
            }

            var rg_event = document.getElementById('rg_event').value;  // 年號
            var rg_event_ch = ""; 
            if (rg_event){
                rg_event_ch = document.getElementById('rg_event').options[document.getElementById('rg_event').selectedIndex].text; // 年號的文字
            }

            var first_event = document.getElementById('first_event').value;  // 1
            var first_event_ch = ""; 
            if (first_event){
                first_event_ch = document.getElementById('first_event').options[document.getElementById('first_event').selectedIndex].text;  // 第一層級別
            }
            var first_all_event_ch = ""; 
            if (document.getElementById('first_all_event').value){
                first_all_event_ch = document.getElementById('first_all_event').options[document.getElementById('first_all_event').selectedIndex].text; //第一層地名跟代碼
            }

            var second_event = document.getElementById('second_event').value;  // 2
            var second_event_ch = ""; 
            if (second_event){
                second_event_ch = document.getElementById('second_event').options[document.getElementById('second_event').selectedIndex].text;  // 第二層級別
            }
            var second_all_event_ch = ""; 
            if (document.getElementById('second_all_event').value){
                second_all_event_ch = document.getElementById('second_all_event').options[document.getElementById('second_all_event').selectedIndex].text; //第二層地名跟代碼
            }

            var third_event = document.getElementById('third_event').value;  // 3
            var third_event_ch = ""; 
            if (third_event){
                third_event_ch = document.getElementById('third_event').options[document.getElementById('third_event').selectedIndex].text;  // 第三層級別
            }
            var third_all_event_ch = ""; 
            if (document.getElementById('third_all_event').value){
                third_all_event_ch = document.getElementById('third_all_event').options[document.getElementById('third_all_event').selectedIndex].text; //第三層地名跟代碼
            }

            var fourth_event = document.getElementById('fourth_event').value;  // 4
            var fourth_event_ch = ""; 
            if (fourth_event){
                fourth_event_ch = document.getElementById('fourth_event').options[document.getElementById('fourth_event').selectedIndex].text;  // 第四層級別
            }
            var fourth_all_event_ch = ""; 
            if (document.getElementById('fourth_all_event').value){
                fourth_all_event_ch = document.getElementById('fourth_all_event').options[document.getElementById('fourth_all_event').selectedIndex].text; //第四層地名跟代碼
            }
            
            var chome_event = document.getElementById('chome_event').value;  // 丁目
            var address_event = document.getElementById('address_event').value;  // 番地
            var of1_event = document.getElementById('of1_event').value;  // 幾之
            var of2_event= document.getElementById('of2_event').value;  // 幾
            
            // 發送POST請求到指定的路徑'/generate-csv'
            fetch('/generate-eventForm-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // 指定請求的內容類型為JSON
                },
                body: JSON.stringify({ id2:id2,perno2:perno2,rg3 : rg3,rg3_ch:rg3_ch , yy3 : yy3 , mm3 : mm3 , dd3 : dd3 , no3:no3,
                    event: event,event_ch:event_ch,
                    relevant_person3:relevant_person3,type2:type2,relationInput:relationInput,relationInput_ch:relationInput_ch,
                    name2:name2,relationshipInput2:relationshipInput2,relationshipInput2_ch:relationshipInput2_ch,
                    rg_event:rg_event,rg_event_ch:rg_event_ch,first_event:first_event,first_event_ch:first_event_ch,first_all_event_ch:first_all_event_ch,
                    second_event:second_event,second_event_ch:second_event_ch,second_all_event_ch:second_all_event_ch,
                    third_event:third_event,third_event_ch:third_event_ch,third_all_event_ch:third_all_event_ch,
                    fourth_event:fourth_event,fourth_event_ch:fourth_event_ch,fourth_all_event_ch:fourth_all_event_ch,
                    chome_event:chome_event,address_event:address_event,of1_event:of1_event,of2_event:of2_event
                    }), // 將輸入的數字轉換為JSON格式並作為請求體發送
            })
            .then(response => response.json()) // 解析回應的JSON數據
            .then(data => {
                alert('事件新建成功!'); // 在產生CSV成功時彈出提示

                // 清除輸入框的值
                //document.getElementById('id2').value = '';
                //document.getElementById('perno2').value = '';
                document.getElementById('rg3').value = '';
                document.getElementById('yy3').value = '';
                document.getElementById('mm3').value = '';
                document.getElementById('dd3').value = '';
                document.getElementById('no3').value = '';
                document.getElementById('eventsearch').value = '';
                document.getElementById('event').value = '';
                document.getElementById('relevant_person3').value = '';
                var type2RadioButtons = document.querySelectorAll('input[name="type2"]');
                type2RadioButtons.forEach(function(radio) {
                    radio.checked = false;
                });
                document.getElementById('relationsearch').value = '';
                document.getElementById('relationInput').value = '';
                document.getElementById('name2').value = '';
                document.getElementById('relationshipsearch2').value = '';
                document.getElementById('relationshipInput2').value = '';
                document.getElementById('rg_event').value = '';
                document.getElementById('first_event').value = '';
                document.getElementById('first_all_event').value = '';
                document.getElementById('second_event').value = '';
                document.getElementById('second_all_event').value = '';
                document.getElementById('third_event').value = '';
                document.getElementById('third_all_event').value = '';
                document.getElementById('fourth_event').value = '';
                document.getElementById('fourth_all_event').value = '';
                document.getElementById('chome_event').value= '';
                document.getElementById('address_event').value= '';
                document.getElementById('of1_event').value= '';
                document.getElementById('of2_event').value= '';

            })
            .catch((error) => {
                console.error('Error:', error); //錯誤提醒
            });
        });
    }})
// 取得特殊事件表單元素
//document.getElementById('specialForm').addEventListener('submit', function(e) {
    // 阻止表單預設提交行為
    //e.preventDefault();
document.addEventListener("DOMContentLoaded", function() {
    const formElement = document.getElementById('specialForm');
    
    if (formElement) {
        formElement.addEventListener('submit', function(e) {
            e.preventDefault();        
            var id4 = document.getElementById('id4').value; // 戶號
            var perno4 = document.getElementById('perno4').value; // 人號
            var special_event = document.getElementById('special_event').value; // 特殊情況
            // 發送POST請求到指定的路徑'/generate-csv'
            fetch('/generate-specialForm-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // 指定請求的內容類型為JSON
                },
                body: JSON.stringify({ id4:id4,perno4:perno4,special_event : special_event
                    }), // 將輸入的數字轉換為JSON格式並作為請求體發送
            })
            .then(response => response.json()) // 解析回應的JSON數據
            .then(data => {
                alert('特殊情況新建成功!'); // 在產生CSV成功時彈出提示

                // 清除輸入框的值
                document.getElementById('id4').value = '';
                document.getElementById('perno4').value = '';
                document.getElementById('special_event').value = '';

            })
            .catch((error) => {
                console.error('Error:', error); //錯誤提醒
            });
        });
    }})

//所有戶冊csv
function loadAllRecords() {
    fetch('household.csv')
        .then(response => response.text())
        .then(csvData => {
            var data = parseCSV2(csvData);
            var tableHtml = "<table>";

            // 表頭
            tableHtml += "<tr>";
            for (var i = 0; i < data[0].length; i++) {
                if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5 || i === 6 || i === 7 || i === 8 || i === 9|| i === 10 || i === 11|| i === 12|| i === 13|| i === 14|| i === 15|| i === 16|| i === 17||i === 18|| i === 19|| i === 20|| i === 21||i === 22||i === 23||i === 24||i === 25||i === 26|| i === 27||i === 28|| i === 29||i === 30|| i === 35||i === 36|| i === 37|| i === 38|| i === 40|| i === 41|| i === 42|| i === 44|| i === 45|| i === 46|| i === 47|| i === 48) {
                    continue; // 跳過 i 為 5、7、8、9 的情況
                }
                tableHtml += "<th>" + data[0][i] + "</th>";
            }
            tableHtml += "</tr>";

            // 表身
            for (var j = 1; j < data.length- 1; j++) {
                tableHtml += "<tr>";
                for (var i = 0; i < data[j].length; i++) {
                    if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5 || i === 6 || i === 7 || i === 8 || i === 9|| i === 10 || i === 11|| i === 12|| i === 13|| i === 14|| i === 15|| i === 16|| i === 17||i === 18|| i === 19|| i === 20|| i === 21||i === 22||i === 23||i === 24||i === 25||i === 26|| i === 27||i === 28|| i === 29||i === 30|| i === 35||i === 36|| i === 37|| i === 38|| i === 40|| i === 41|| i === 42|| i === 44|| i === 45|| i === 46|| i === 47|| i === 48) {
                        continue; // 跳過 i 為 5、7、8、9 的情況
                    }
                    tableHtml += "<td>" + data[j][i] + "</td>";
                }
                tableHtml += "</tr>";
            }

            tableHtml += "</table>";
            document.getElementById("csvTable").innerHTML = tableHtml;
        })
        .catch(error => {
            console.error('Error loading CSV file:', error);
        });
}
window.onload = function() {
    // 檢查當前頁面的URL或文件名
    if (window.location.pathname.endsWith('house_search.html')) {
        loadAllRecords(); // 只在 house_search.html 加載並顯示所有的 CSV 紀錄
    }
};

//查詢戶冊
function searchhousehold() {
    // 隱藏所有csv內容
    document.getElementById("allRecords").style.display = "none";
    // 獲取查詢的戶號
    var id = document.getElementById("id").value;
  
    // 使用 fetch 加載文件
    fetch('household.csv')
        .then(response => response.text())
        .then(csvData => {
            // 讀取csv
            var data = parseCSV2(csvData);
  
            // 查找名字匹配的行
            var results = data.filter(function(row) {
                return row[0] === id; // 戶號
            });
  
            // 顯示結果
            var resultDiv = document.getElementById("result");
            if (results.length > 0) {
                var tableHtml = "<h3>查詢結果：</h3><table>";
                // 表頭
                tableHtml += "<tr>";
                tableHtml += "<th>修改</th>"; // 新增修改欄位
                for (var i = 0; i < data[0].length; i++) {
                    if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5 || i === 6 || i === 7 || i === 8 || i === 9|| i === 10 || i === 11|| i === 12|| i === 13|| i === 14|| i === 15|| i === 16|| i === 17||i === 18|| i === 19|| i === 20|| i === 21||i === 22||i === 23||i === 24||i === 25||i === 26|| i === 27||i === 28|| i === 29||i === 30|| i === 35||i === 36|| i === 37|| i === 38|| i === 40|| i === 41|| i === 42|| i === 44|| i === 45|| i === 46|| i === 47|| i === 48) {
                        continue; // 跳過 i 為 5、7、8、9 的情況
                    }
                    tableHtml += "<th>" + data[0][i] + "</th>";
                }
                tableHtml += "<th>刪除</th>"; // 新增刪除欄位
                tableHtml += "</tr>";
                // 表身
                for (var j = 0; j < results.length; j++) {
                    tableHtml += "<tr>";
                    // 修改欄位及單選框
                    tableHtml += "<td><input type='radio' name='modify' onclick='fillInputs(" + JSON.stringify(results[j]) + ")'></td>";
                    for (var i = 0; i < results[j].length; i++) {
                        if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5 || i === 6 || i === 7 || i === 8 || i === 9|| i === 10 || i === 11|| i === 12|| i === 13|| i === 14|| i === 15|| i === 16|| i === 17||i === 18|| i === 19|| i === 20|| i === 21||i === 22||i === 23||i === 24||i === 25||i === 26|| i === 27||i === 28|| i === 29||i === 30|| i === 35||i === 36|| i === 37|| i === 38|| i === 40|| i === 41|| i === 42|| i === 44|| i === 45|| i === 46|| i === 47|| i === 48) {
                            continue; // 跳過 i 為 5、7、8、9 的情況
                        }
                        tableHtml += "<td>" + results[j][i] + "</td>";
                    }
                    // 刪除按鈕
                    tableHtml += "<td><button onclick='deleteRow_house("+ JSON.stringify(results[j]) +")'>刪除</button></td>";
                }
                tableHtml += "</table>";
                resultDiv.innerHTML = tableHtml;

            } else {
                resultDiv.innerHTML = "<p>找不到相符的資料。</p>";
            }
        })
        .catch(error => {
            console.error('Error loading CSV file:', error);
        });
  }

//下拉選單回填時將值合併
function setSelectedIndex(rowData,elementId,n,n2) {

    var Number = rowData[n]; // 從 CSV 文件中獲取的值 11
    var Name = rowData[n2]; // 從 CSV 文件中獲取的值 明治
    var Value = Number + " " + Name; // 拼接起來 11 明治
    var selectElement = document.getElementById(elementId);
    // 清除前一筆的回填
    selectElement.selectedIndex = -1;
    for (var i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].text === Value) {
            selectElement.selectedIndex = i;
            break;
        }
    }
}

// 將 CSV 欄位的內容回填到 HTML 表單的輸入框中
function fillInputs(rowData) {
    document.getElementById("rg").selectedIndex = -1;
    document.getElementById("first").selectedIndex = -1;
    document.getElementById("first_all").selectedIndex = -1;
    document.getElementById("second").selectedIndex = -1;
    document.getElementById("second_all").selectedIndex = -1;
    document.getElementById("third").selectedIndex = -1;
    document.getElementById("third_all").selectedIndex = -1;
    document.getElementById("fourth").selectedIndex = -1;
    document.getElementById("fourth_all").selectedIndex = -1;
    // 先隱藏所有欄位
    var hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(function(element) {
        element.classList.remove('hidden');
    });
    document.getElementById("id").value = rowData[0]; //戶號
    // 是否有斜線
    var typeValue2 = rowData[1]; // 從 CSV 文件中獲取的值
    if (typeValue2 === "1") {
        document.getElementById("yes").checked = true; // 是
    } else if (typeValue2 === "0") {
        document.getElementById("no").checked = true; // 否
    }
    // 戶冊別
    var typeValue = rowData[2]; // 從 CSV 文件中獲取的值
    if (typeValue === "1") {
        document.getElementById("origin").checked = true; // 本冊
    } else if (typeValue === "2") {
        document.getElementById("remove").checked = true; // 除冊
    } else if (typeValue === "3") {
        document.getElementById("stay").checked = true; // 寄留戶
    }

    //年號
    setSelectedIndex(rowData,"rg",3,4)

    // 更新第一層選單，並在更新完成後執行相應的操作
    updateFirst(rowData[3], "first", function() {
        // 第一層
        setSelectedIndex(rowData,"first",5,6)
    });

    //更新第一層地名 selectedLevel,first_all,rg
    if (rowData[5] !== "") { 
        updateFirstAll(rowData[5], "first_all","rg", function() { 
            // 第一層地名
            setSelectedIndex(rowData,"first_all",7,8) 
            var first_all_selectElement = document.getElementById("first_all").value; //第一層地名的識別碼

            // 更新第二層選單，並在更新完成後執行相應的操作
            updateSecond(first_all_selectElement, "second", function() {
                // 第二層
                setSelectedIndex(rowData,"second",9,10)

            });
            //第二層地名
            updateSecondAll(rowData[9], "first_all","second_all", function() {
                // 第二層地名
                setSelectedIndex(rowData,"second_all",11,12) 
                var second_all_selectElement = document.getElementById("second_all").value; //第二層地名的識別碼
                // 第三層選單
                updatethird(second_all_selectElement, "third", function() {
                    // 第三層
                    setSelectedIndex(rowData,"third",13,14)
                });

                //第三層地名
                updatethirdAll(rowData[13], "second_all","third_all", function() {
                    // 第三層地名
                    setSelectedIndex(rowData,"third_all",15,16)
                    var third_all_selectElement = document.getElementById("third_all").value; //第三層地名的識別碼
                    // 第四層選單
                    updatefourth(third_all_selectElement, "fourth", function() {
                        // 第4層
                        setSelectedIndex(rowData,"fourth",17,18)
                    });
                    //第4層地名
                    updatefourthAll(rowData[17], "third_all","fourth_all", function() {
                        // 第4層地名
                        setSelectedIndex(rowData,"fourth_all",19,20)
                    });
                });
            });
            
        });
    }
    document.getElementById("chome").value = rowData[21]; //丁目
    document.getElementById("address").value = rowData[22]; //番地
    document.getElementById("of1").value = rowData[23]; //之
    document.getElementById("of2").value = rowData[24]; //之

    // 是否有修改
    var reviseValue2 = rowData[25]; // 從 CSV 文件中獲取的值
    if (reviseValue2 === "1") {
        document.getElementById("yes").checked = true; // 是
    } else if (reviseValue2 === "0") {
        document.getElementById("no").checked = true; // 否
    }

    document.getElementById("origin_address").value = rowData[26]; //本居又ハ本國住所
    // 無此欄位
    var o_addValue = rowData[27]; // 從 CSV 文件中獲取的值
    if (o_addValue === "1") {
        document.getElementById("o_add_no").checked = true;
        document.getElementById("o_add_no").value = "1";
    } else {
        document.getElementById("o_add_no").checked = false;
        document.getElementById("o_add_no").value = "0";
    }

    document.getElementById("clan_name").value = rowData[28]; //族稱
     // 無此欄位
    var c_nameValue = rowData[29]; // 從 CSV 文件中獲取的值
    if (c_nameValue === "1") {
        document.getElementById("c_name_no").checked = true;
        document.getElementById("c_name_no").value = "1";
    } else {
        document.getElementById("c_name_no").checked = false;
        document.getElementById("c_name_no").value = "0";
    }

    //開戶日期
    setSelectedIndex(rowData,"rg2",30,31)
    document.getElementById("yy2").value = rowData[32]; //年
    document.getElementById("mm2").value = rowData[33]; //月
    document.getElementById("dd2").value = rowData[34]; //日

    //開戶原由
    setSelectedIndex(rowData,"reason",35,36)
    //前戶主退由
    setSelectedIndex(rowData,"ex_reason",37,38)
    document.getElementById("o_name").value = rowData[39]; //戶主名字
    document.getElementById("o_yy2").value = rowData[40]; //年
    document.getElementById("o_mm2").value = rowData[41]; //月
    document.getElementById("o_dd2").value = rowData[42]; //日
    document.getElementById("ex_name").value = rowData[43]; //前戶主名字
    //與前戶主續柄
    setSelectedIndex(rowData,"ex_relationshipInput",44,45)
    //戶主職業
    setSelectedIndex(rowData,"job3",46,47)
    //index
    document.getElementById("indexInput").value = rowData[48];

}
//修改戶冊
function modifyHousehold() {
    // 獲取 indexInput 的值
    var index = document.getElementById("indexInput").value;
    var id = document.getElementById('id').value; // 戶號
    var slashInput = document.querySelector('input[name="slash"]:checked');// 斜線
    if (slashInput) {
        var slash = slashInput.value; 
    } else {
        var slash = ""; 
    }
    var typeInput = document.querySelector('input[name="type"]:checked');// 戶冊別
    if (typeInput) {
        var type = typeInput.value; 
    } else {
        var type = ""; 
    }
    //var origin_id = document.getElementById('origin_id').value; // 本居id

    var rg = document.getElementById('rg').value;  // 年號
    var rg_ch = ""; // 年號的文字
    if (rg){
        rg_ch = document.getElementById('rg').options[document.getElementById('rg').selectedIndex].text;
    }
    
    var first = document.getElementById('first').value;  // 1
    var first_ch = "";
    if (first){
        first_ch = document.getElementById('first').options[document.getElementById('first').selectedIndex].text;  // 第一層級別
    }
    var first_all_ch= "";
    if (document.getElementById('first_all').value){
        first_all_ch = document.getElementById('first_all').options[document.getElementById('first_all').selectedIndex].text; //第一層地名跟代碼
    }

    var second = document.getElementById('second').value;  // 2
    var second_ch = "";
    if (second){
        second_ch = document.getElementById('second').options[document.getElementById('second').selectedIndex].text;  // 第二層級別
    }
    var second_all_ch= "";
    if (document.getElementById('second_all').value){
        second_all_ch = document.getElementById('second_all').options[document.getElementById('second_all').selectedIndex].text; //第二層地名跟代碼
    }  

    var third = document.getElementById('third').value;  // 3
    var third_ch = "";
    if (third){
        third_ch = document.getElementById('third').options[document.getElementById('third').selectedIndex].text;  // 第三層級別
    }
    var third_all_ch= "";
    if (document.getElementById('third_all').value){
        third_all_ch = document.getElementById('third_all').options[document.getElementById('third_all').selectedIndex].text; //第三層地名跟代碼
    }  

    var fourth = document.getElementById('fourth').value;  // 4
    var fourth_ch = "";
    if (fourth){
        fourth_ch = document.getElementById('fourth').options[document.getElementById('fourth').selectedIndex].text;   // 第四層級別
    }
    var fourth_all_ch= "";
    if (document.getElementById('fourth_all').value){
        fourth_all_ch = document.getElementById('fourth_all').options[document.getElementById('fourth_all').selectedIndex].text; //第四層地名跟代碼
    }  

    var chome = document.getElementById('chome').value;  // 丁目
    var address = document.getElementById('address').value;  // 番地
    var of1 = document.getElementById('of1').value;  // 幾之
    var of2 = document.getElementById('of2').value;  // 幾

    var reviseInput = document.querySelector('input[name="revise"]:checked');// 是否修改
    if (reviseInput) {
        var revise = reviseInput.value; 
    } else {
        var revise = ""; 
    }

    var origin_address = document.getElementById('origin_address').value; // 本國住所
    var o_add_no_checkbox = document.getElementById('o_add_no'); // 無此欄位=1
    var o_add_no_checkboxValue = o_add_no_checkbox.checked ? 1 : 0;

    var clan_name = document.getElementById('clan_name').value; // 族稱
    var c_name_no_checkbox = document.getElementById('c_name_no'); // 無此欄位=1
    var c_name_no_checkboxValue = c_name_no_checkbox.checked ? 1 : 0;

    var rg2 = document.getElementById('rg2').value;  // 年號2
    var rg2_ch = "";
    if (rg2){
        rg2_ch= document.getElementById('rg2').options[document.getElementById('rg2').selectedIndex].text; // 年號的文字
    }

    var yy2 = document.getElementById('yy2').value; //年2
    var mm2 = document.getElementById('mm2').value; //月2
    var dd2 = document.getElementById('dd2').value; //日2

    var reason = document.getElementById('reason').value;  // 開戶原由
    var reason_ch = "";
    if (reason){
        reason_ch = document.getElementById('reason').options[document.getElementById('reason').selectedIndex].text;  // 戶主事由的文字
    }
    var ex_reason = document.getElementById('ex_reason').value;  // 前戶主退由
    var ex_reason_ch = "";
    if (ex_reason){
        ex_reason_ch = document.getElementById('ex_reason').options[document.getElementById('ex_reason').selectedIndex].text;  // 前戶主事由的文字
    }
    var o_name = document.getElementById('o_name').value; //戶主
    var o_yy2 = document.getElementById('o_yy2').value; //年
    var o_mm2 = document.getElementById('o_mm2').value; //月
    var o_dd2 = document.getElementById('o_dd2').value; //日

    var ex_name = document.getElementById('ex_name').value; //前戶主
    var ex_relationship = document.getElementById('ex_relationshipInput').value; // 前戶主續柄
    var ex_relationship_ch = ""; 
    if (ex_relationship){
        ex_relationship_ch = document.getElementById('ex_relationshipInput').options[document.getElementById('ex_relationshipInput').selectedIndex].text; // 前戶主續柄的文字
    }

    var job3 = document.getElementById('job3').value; //前戶主職業
    var job3_ch = ""; 
    if (job3){
        job3_ch = document.getElementById('job3').options[document.getElementById('job3').selectedIndex].text; // 職業的文字
    }

    // 發送 POST 請求到指定的路徑'/modify-householdForm-csv'
    fetch('/modify-householdForm-csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // 指定請求的內容類型為JSON
        },
        body: JSON.stringify({id:id,slash:slash,type:type,
            rg:rg,rg_ch:rg_ch,first:first,first_ch:first_ch, first_all_ch:first_all_ch,
            second:second,second_ch:second_ch,second_all_ch:second_all_ch,
            third:third,third_ch:third_ch,third_all_ch:third_all_ch,
            fourth:fourth,fourth_ch:fourth_ch,fourth_all_ch:fourth_all_ch,
            chome:chome,address:address,of1:of1,of2:of2,
            revise:revise,
            origin_address:origin_address,o_add_no_checkboxValue:o_add_no_checkboxValue,
            clan_name:clan_name,c_name_no_checkboxValue:c_name_no_checkboxValue,
            rg2:rg2,rg2_ch:rg2_ch,yy2:yy2,mm2:mm2,dd2:dd2,
            reason:reason,reason_ch:reason_ch,ex_reason:ex_reason,ex_reason_ch:ex_reason_ch,
            o_name:o_name,o_yy2:o_yy2,o_mm2:o_mm2,o_dd2:o_dd2,
            ex_name:ex_name,ex_relationship:ex_relationship,ex_relationship_ch:ex_relationship_ch,job3:job3,job3_ch:job3_ch,index:index}), // 將輸入的數字轉換為JSON格式並作為請求體發送
    })
    .then(response => response.json()) // 解析回應的JSON數據
    .then(data => {
        alert('戶冊修改成功!'); // 在產生CSV成功時彈出提示

        // 清除輸入框的值
        document.getElementById('id').value = '';
        var slashRadioButtons = document.querySelectorAll('input[name="slash"]');
        slashRadioButtons.forEach(function(radio) {
            radio.checked = false;
        });
        var typeRadioButtons = document.querySelectorAll('input[name="type"]');
        typeRadioButtons.forEach(function(radio) {
            radio.checked = false;
        });
        document.getElementById('rg').value= '';
        document.getElementById('first').value= '';
        document.getElementById('first_all').value= '';
        document.getElementById('second').value= '';
        document.getElementById('second_all').value= '';
        document.getElementById('third').value= '';
        document.getElementById('third_all').value= '';
        document.getElementById('fourth').value= '';
        document.getElementById('fourth_all').value= '';
        document.getElementById('chome').value= '';
        document.getElementById('address').value= '';
        document.getElementById('of1').value= '';
        document.getElementById('of2').value= '';
        var reviseRadioButtons = document.querySelectorAll('input[name="revise"]');
        reviseRadioButtons.forEach(function(radio) {
            radio.checked = false;
        });
        document.getElementById('origin_address').value= '';
        document.getElementById('o_add_no').checked = false; // 清除复选框状态
        document.getElementById('o_add_no').value = '0'; // 恢复默认值
        document.getElementById('clan_name').value= '';
        document.getElementById('c_name_no').checked = false; // 清除复选框状态
        document.getElementById('c_name_no').value = '0'; // 恢复默认值
        document.getElementById('rg2').value= '';
        document.getElementById('yy2').value= '';
        document.getElementById('mm2').value= '';
        document.getElementById('dd2').value= '';
        document.getElementById('reason').value= '';
        document.getElementById('ex_reason').value= '';
        document.getElementById('o_name').value= '';
        document.getElementById('o_yy2').value= '';
        document.getElementById('o_mm2').value= '';
        document.getElementById('o_dd2').value= '';
        document.getElementById('ex_name').value= '';
        document.getElementById('ex_relationshipsearch').value= '';
        document.getElementById('ex_relationshipInput').value= '';
        document.getElementById('job3search').value = '';
        document.getElementById('job3').value = '';
    })
}


//查詢成員
function searchmember() {
    // 獲取查詢的戶號
    var id1 = document.getElementById("id1").value;
    var perno = document.getElementById("perno").value;
  
    // 使用 fetch 加載文件
    fetch('person.csv')
        .then(response => response.text())
        .then(csvData => {
            // 讀取csv
            var data = parseCSV2(csvData);
  
            // 查找匹配的行
            var results = data.filter(function(row) {
                // 如果兩者都有，則必須都匹配
                if (id1 && perno) {
                    return row[0] === id1 && row[1] === perno;
                }
                // 如果只有戶號，則匹配戶號
                else if (id1) {
                    return row[0] === id1;
                }
                // 如果只有人號，則匹配人號
                else if (perno) {
                    return row[1] === perno;
                }
                return false; // 如果都沒有提供，返回空
            });
  
            // 顯示結果
            var resultDiv = document.getElementById("result2");
            if (results.length > 0) {
                var tableHtml = "<h3>查詢結果：</h3><table>";
                // 表頭
                tableHtml += "<tr>";
                tableHtml += "<th>修改</th>"; // 新增修改欄位
                for (var i = 0; i < data[0].length; i++) {
                    if (i === 2 ||i === 4 || i === 5 || i === 6 || i === 7|| i === 8|| i === 9|| i === 16|| i === 17|| i === 18|| i === 20|| i === 21|| i === 22|| i === 23|| i === 24|| i === 25|| i === 26|| i === 27|| i === 28|| i === 29|| i === 30|| i === 31|| i === 32|| i === 33|| i === 34|| i === 35|| i === 36|| i === 37) {
                        continue; // 跳過
                    }
                    tableHtml += "<th>" + data[0][i] + "</th>";
                }
                tableHtml += "<th>刪除</th>"; // 新增刪除欄位
                tableHtml += "</tr>";
                // 表身
                for (var j = 0; j < results.length; j++) {
                    tableHtml += "<tr>";
                    // 修改欄位及單選框
                    tableHtml += "<td><input type='radio' name='modify' onclick='fillInputs2(" + JSON.stringify(results[j]) + ")'></td>";
                    for (var i = 0; i < results[j].length; i++) {
                        if (i === 2 ||i === 4 || i === 5 || i === 6 || i === 7|| i === 8|| i === 9|| i === 16|| i === 17|| i === 18|| i === 20|| i === 21|| i === 22|| i === 23|| i === 24|| i === 25|| i === 26|| i === 27|| i === 28|| i === 29|| i === 30|| i === 31|| i === 32|| i === 33|| i === 34|| i === 35|| i === 36|| i === 37) {
                            continue; // 跳過
                        }
                        tableHtml += "<td>" + results[j][i] + "</td>";
                    }
                    // 刪除按鈕
                    tableHtml += "<td><button onclick='deleteRow_member("+ JSON.stringify(results[j]) +")'>刪除</button></td>";
                    tableHtml += "</tr>";
                }
                tableHtml += "</table>";
                resultDiv.innerHTML = tableHtml;

            } else {
                resultDiv.innerHTML = "<p>找不到相符的資料。</p>";
            }
        })
        .catch(error => {
            console.error('Error loading CSV file:', error);
        });
}

// 將 CSV 欄位的內容回填到 HTML 表單的輸入框中
function fillInputs2(rowData) {
    // 先隱藏所有欄位
    var hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(function(element) {
        element.classList.remove('hidden');
    });
    document.getElementById("id1").value = rowData[0]; //戶號
    document.getElementById("perno").value = rowData[1]; //人號
    // 是否有斜線
    var typeValue = rowData[2]; // 從 CSV 文件中獲取的值
    if (typeValue === "1") {
        document.getElementById("yes2").checked = true; // 是
    } else if (typeValue === "0") {
        document.getElementById("no2").checked = true; // 否
    }
    document.getElementById("nameInput").value = rowData[3]; //姓名
    document.getElementById("nameInput2").value = rowData[4]; 
    document.getElementById("nameInput3").value = rowData[5]; 
    document.getElementById("nameInput4").value = rowData[6]; 
    document.getElementById("nameInput5").value = rowData[7]; 
    // 性別
    var typeValue2 = rowData[8]; // 從 CSV 文件中獲取的值
    if (typeValue2 === "1") {
        document.getElementById("male").checked = true; // 男
    } else if (typeValue2 === "2") {
        document.getElementById("female").checked = true; // 女
    }

    //生日
    setSelectedIndex(rowData,"reign",9,10)
    document.getElementById("yy").value = rowData[11]; //年
    document.getElementById("mm").value = rowData[12]; //月
    document.getElementById("dd").value = rowData[13]; //日

    document.getElementById("father").value = rowData[14]; //父親
    document.getElementById("mother").value = rowData[15]; //母親
    //出生別
    setSelectedIndex(rowData,"porder",16,17)
    //續柄
    setSelectedIndex(rowData,"relationshipInput",18,19)
    //職業
    setSelectedIndex(rowData,"job1",20,21)
    setSelectedIndex(rowData,"job2",22,23)
    //種族
    setSelectedIndex(rowData,"race",24,25)
    setSelectedIndex(rowData,"opium",26,27) //阿片
    setSelectedIndex(rowData,"foot_binding",28,29) //纏足
    // 是否有斜線
    var relevant_ysValue = rowData[30]; // 從 CSV 文件中獲取的值
    if (relevant_ysValue === "1") {
        document.getElementById("yes_ys").checked = true; // 是
    } else if (relevant_ysValue === "0") {
        document.getElementById("no_ys").checked = true; // 否
    }
    //初始關係
    setSelectedIndex(rowData,"initial_relationship1",31,32)
    document.getElementById("relevant_person1").value = rowData[33]; //關係人名字
    setSelectedIndex(rowData,"initial_relationship2",34,35)
    document.getElementById("relevant_person2").value = rowData[36]; //關係人名字

    //index
    document.getElementById("indexInput2").value = rowData[37];
}

//修改
function modifyHousehold2() {
    // 獲取 indexInput 的值
    var index2 = document.getElementById("indexInput2").value;
    var id1 = document.getElementById('id1').value; // 序號
    var perno = document.getElementById('perno').value; // 人號
    var slashInput2 = document.querySelector('input[name="slash2"]:checked');// 斜線
    if (slashInput2) {
        var slash2 = slashInput2.value; 
    } else {
        var slash2 = ""; 
    }

    var name = document.getElementById('nameInput').value; // 名字
    var name2 = document.getElementById('nameInput2').value; // 名字2
    var name3 = document.getElementById('nameInput3').value; // 名字3
    var name4 = document.getElementById('nameInput4').value; // 名字4
    var name5 = document.getElementById('nameInput5').value; // 名字5
    var reign = document.getElementById('reign').value;  // 年號
    var reign_ch = ""; 
    if (reign){
        reign_ch = document.getElementById('reign').options[document.getElementById('reign').selectedIndex].text; // 年號的文字
    }
    var yy = document.getElementById('yy').value; //年
    var mm = document.getElementById('mm').value; //月
    var dd = document.getElementById('dd').value; //日
    var genderInput = document.querySelector('input[name="gender"]:checked');// 性別
    if (genderInput) {
        var sex = genderInput.value; 
    } else {
        var sex = ""; 
    }
    var father = document.getElementById('father').value; //父
    var mother = document.getElementById('mother').value; //母
    var porder = document.getElementById('porder').value; //出生別
    var porder_ch = ""; 
    if (porder){
        porder_ch = document.getElementById('porder').options[document.getElementById('porder').selectedIndex].text; // 出生別的文字
    }
    var relationship = document.getElementById('relationshipInput').value; // 續柄
    var relationship_ch = ""; 
    if (relationship){
        relationship_ch = document.getElementById('relationshipInput').options[document.getElementById('relationshipInput').selectedIndex].text; // 續柄的文字
    }
    var job1 = document.getElementById('job1').value; //職業1
    var job1_ch = ""; 
    if (job1){
        job1_ch = document.getElementById('job1').options[document.getElementById('job1').selectedIndex].text; // 職業1的文字
    }
    var job2 = document.getElementById('job2').value; //職業2
    var job2_ch = ""; 
    if (job2){
        job2_ch = document.getElementById('job2').options[document.getElementById('job2').selectedIndex].text; // 職業2的文字
    }
    var race = document.getElementById('race').value; // 種族
    var race_ch = ""; 
    if (race){
        race_ch = document.getElementById('race').options[document.getElementById('race').selectedIndex].text; // 種族的文字
    }
    var opium = document.getElementById('opium').value; //鴉片
    var opium_ch = ""; 
    if (opium){
        opium_ch = document.getElementById('opium').options[document.getElementById('opium').selectedIndex].text; // 鴉片的文字
    }
    var foot_binding = document.getElementById('foot_binding').value; //纏足
    var foot_binding_ch = ""; 
    if (foot_binding){
        foot_binding_ch = document.getElementById('foot_binding').options[document.getElementById('foot_binding').selectedIndex].text; // 纏足的文字
    }
    var relevant_ysInput = document.querySelector('input[name="relevant_ys"]:checked');// 斜線
    if (relevant_ysInput) {
        var relevant_ys = relevant_ysInput.value; 
    } else {
        var relevant_ys = ""; 
    }
    var initial_relationship1 = document.getElementById('initial_relationship1').value; //初始關係1
    var initial_relationship1_ch = ""; 
    if (initial_relationship1){
        initial_relationship1_ch = document.getElementById('initial_relationship1').options[document.getElementById('initial_relationship1').selectedIndex].text; // 初始關係1的文字
    }
    var relevant_person1 = document.getElementById('relevant_person1').value; //關係人1
    var initial_relationship2 = document.getElementById('initial_relationship2').value; //初始關係2
    var initial_relationship2_ch = ""; 
    if (initial_relationship2){
        initial_relationship2_ch = document.getElementById('initial_relationship2').options[document.getElementById('initial_relationship2').selectedIndex].text; // 初始關係2的文字
    }
    var relevant_person2 = document.getElementById('relevant_person2').value; //關係人2

     // 發送POST請求到指定的路徑'/generate-csv'
     fetch('/modify-generate-csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // 指定請求的內容類型為JSON
        },
        body: JSON.stringify({ id1 : id1 ,perno:perno,slash2:slash2, name : name,name2:name2,name3:name3,name4:name4,name5:name5, reign : reign,reign_ch:reign_ch , yy : yy , mm : mm , dd : dd , 
            sex : sex ,father:father,mother:mother,porder:porder,porder_ch:porder_ch,relationship:relationship,relationship_ch:relationship_ch,job1:job1,job1_ch:job1_ch,
            job2:job2,job2_ch:job2_ch,race:race,race_ch:race_ch,opium:opium,opium_ch:opium_ch,foot_binding:foot_binding,foot_binding_ch:foot_binding_ch,
            relevant_ys:relevant_ys,
            initial_relationship1:initial_relationship1,initial_relationship1_ch:initial_relationship1_ch,relevant_person1:relevant_person1,initial_relationship2:initial_relationship2,initial_relationship2_ch:initial_relationship2_ch,relevant_person2:relevant_person2,index2:index2}), // 將輸入的數字轉換為JSON格式並作為請求體發送
    })
    .then(response => response.json()) // 解析回應的JSON數據
    .then(data => {
        alert('成員修改成功!'); // 在產生CSV成功時彈出提示

        // 清除輸入框的值
        document.getElementById('id1').value = '';
        document.getElementById('perno').value = '';
        var slashRadioButtons2 = document.querySelectorAll('input[name="slash2"]');
        slashRadioButtons2.forEach(function(radio) {
            radio.checked = false;
        });
        document.getElementById('nameInput').value = '';
        document.getElementById('nameInput2').value = '';
        document.getElementById('nameInput3').value = '';
        document.getElementById('nameInput4').value = '';
        document.getElementById('nameInput5').value = '';
        document.getElementById('reign').value = '';
        document.getElementById('yy').value = '';
        document.getElementById('mm').value = '';
        document.getElementById('dd').value = '';
        var genderRadioButtons = document.querySelectorAll('input[name="gender"]');
        genderRadioButtons.forEach(function(radio) {
            radio.checked = false;
        });
        document.getElementById('father').value = '';
        document.getElementById('mother').value = '';
        document.getElementById('porder').value = '';
        document.getElementById('relationshipsearch').value = '';
        document.getElementById('relationshipInput').value = '';
        document.getElementById('job1search').value = '';
        document.getElementById('job1').value = '';
        document.getElementById('job2search').value = '';
        document.getElementById('job2').value = '';
        document.getElementById('race').value= ''; 
        document.getElementById('opium').value= ''; 
        document.getElementById('foot_binding').value= '';
        var relevant_ysRadioButtons = document.querySelectorAll('input[name="relevant_ys"]');
                relevant_ysRadioButtons.forEach(function(radio) {
                    radio.checked = false;
                });
        document.getElementById('initial_relationship1').value= ''; 
        document.getElementById('relevant_person1').value= ''; 
        document.getElementById('initial_relationship2').value= ''; 
        document.getElementById('relevant_person2').value= ''; 
        document.getElementById('indexInput2').value= ''; 

        // 更改背景顏色為預設
        changeBackgroundColor('#b7b7a4');

    })
    .catch((error) => {
        console.error('Error:', error); //錯誤提醒
    });
}

//查詢事件
function searchevent() {
    // 獲取查詢的戶號與人號
    var id2 = document.getElementById("id2").value;
    var perno2 = document.getElementById("perno2").value;
  
    // 使用 fetch 加載文件
    fetch('event.csv')
        .then(response => response.text())
        .then(csvData => {
            // 讀取csv
            var data = parseCSV2(csvData);
  
            // 查找名字匹配的行
            var results = data.filter(function(row) {
                return row[0] === id2 && row[1] === perno2; // 戶號與人號
            });
  
            // 顯示結果
            var resultDiv = document.getElementById("result3");
            if (results.length > 0) {
                var tableHtml = "<h3>查詢結果：</h3><table>";
                // 表頭
                tableHtml += "<tr>";
                tableHtml += "<th>修改</th>"; // 新增修改欄位
                for (var i = 0; i < data[0].length; i++) {
                    if (i === 2 || i === 8|| i === 11|| i === 12|| i === 14|| i === 15|| i === 16|| i === 17|| i === 18|| i === 19|| i === 20|| i === 21|| i === 22|| i === 23|| i === 24|| i === 25|| i === 26|| i === 27|| i === 28|| i === 29|| i === 30|| i === 31|| i === 32|| i === 33|| i === 34|| i === 35|| i === 36|| i === 37|| i === 38|| i === 39) {
                        continue; // 跳過
                    }
                    tableHtml += "<th>" + data[0][i] + "</th>";
                }
                tableHtml += "<th>刪除</th>"; // 新增刪除欄位
                tableHtml += "</tr>";
                // 表身
                for (var j = 0; j < results.length; j++) {
                    tableHtml += "<tr>";
                    // 修改欄位及單選框
                    tableHtml += "<td><input type='radio' name='modify' onclick='fillInputs3(" + JSON.stringify(results[j]) + ")'></td>";
                    for (var i = 0; i < results[j].length; i++) {
                        if (i === 2 || i === 8|| i === 11|| i === 12|| i === 14|| i === 15|| i === 16|| i === 17|| i === 18|| i === 19|| i === 20|| i === 21|| i === 22|| i === 23|| i === 24|| i === 25|| i === 26|| i === 27|| i === 28|| i === 29|| i === 30|| i === 31|| i === 32|| i === 33|| i === 34|| i === 35|| i === 36|| i === 37|| i === 38|| i === 39) {
                            continue; // 跳過
                        }
                        tableHtml += "<td>" + results[j][i] + "</td>";
                    }
                    // 刪除按鈕
                    tableHtml += "<td><button onclick='deleteRow_event("+ JSON.stringify(results[j]) +")'>刪除</button></td>";
                    tableHtml += "</tr>";
                }
                tableHtml += "</table>";
                resultDiv.innerHTML = tableHtml;

            } else {
                resultDiv.innerHTML = "<p>找不到相符的資料。</p>";
            }
        })
        .catch(error => {
            console.error('Error loading CSV file:', error);
        });
}

// 將 CSV 欄位的內容回填到 HTML 表單的輸入框中
function fillInputs3(rowData) {
    document.getElementById("first_event").selectedIndex = -1;
    document.getElementById("first_all_event").selectedIndex = -1;
    document.getElementById("second_event").selectedIndex = -1;
    document.getElementById("second_all_event").selectedIndex = -1;
    document.getElementById("third_event").selectedIndex = -1;
    document.getElementById("third_all_event").selectedIndex = -1;
    document.getElementById("fourth_event").selectedIndex = -1;
    document.getElementById("fourth_all_event").selectedIndex = -1;
    // 先隱藏所有欄位
    var hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(function(element) {
        element.classList.remove('hidden');
    });


    document.getElementById("id2").value = rowData[0]; //戶號
    document.getElementById("perno2").value = rowData[1]; //人號
    //日期
    setSelectedIndex(rowData,"rg3",2,3)
    document.getElementById("yy3").value = rowData[4]; //年
    document.getElementById("mm3").value = rowData[5]; //月
    document.getElementById("dd3").value = rowData[6]; //日
    document.getElementById("no3").value = rowData[7]; //序次
    setSelectedIndex(rowData,"event",8,9)//事件
    document.getElementById("relevant_person3").value = rowData[10]; //關係人
    // 本戶或他戶
    var type2Value = rowData[11]; // 從 CSV 文件中獲取的值
    if (type2Value === "1") {
        document.getElementById("self").checked = true; // 本戶
    } else if (type2Value === "2") {
        document.getElementById("other").checked = true; // 他戶
    }
    setSelectedIndex(rowData,"relationInput",12,13)//關係
    //他戶
    document.getElementById("name2").value = rowData[14]; //戶主
    setSelectedIndex(rowData,"relationshipInput2",15,16)//續柄
    //住所
    setSelectedIndex(rowData,"rg_event",17,18)//年號
    // 更新第一層選單，並在更新完成後執行相應的操作
    updateFirst(rowData[17], "first_event", function() {
        // 第一層
        setSelectedIndex(rowData,"first_event",19,20)
    });

    //更新第一層地名 selectedLevel,first_all,rg
    if (rowData[18] !== "") {
        updateFirstAll(rowData[19], "first_all_event","rg_event", function() {
            // 第一層地名
            setSelectedIndex(rowData,"first_all_event",21,22)
            var first_all_selectElement2 = document.getElementById("first_all_event").value; //第一層地名的識別碼

            // 更新第二層選單，並在更新完成後執行相應的操作
            updateSecond(first_all_selectElement2, "second_event", function() {
                // 第二層
                setSelectedIndex(rowData,"second_event",23,24)

            });
            //第二層地名
            updateSecondAll(rowData[23], "first_all_event","second_all_event", function() {
                // 第二層地名
                setSelectedIndex(rowData,"second_all_event",25,26)
                var second_all_selectElement2 = document.getElementById("second_all_event").value; //第二層地名的識別碼
                // 第三層選單
                updatethird(second_all_selectElement2, "third_event", function() {
                    // 第三層
                    setSelectedIndex(rowData,"third_event",27,28)
                });

                //第三層地名
                updatethirdAll(rowData[27], "second_all_event","third_all_event", function() {
                    // 第三層地名
                    setSelectedIndex(rowData,"third_all_event",29,30)
                    var third_all_selectElement2 = document.getElementById("third_all_event").value; //第三層地名的識別碼
                    // 第四層選單
                    updatefourth(third_all_selectElement2, "fourth_event", function() {
                        // 第4層
                        setSelectedIndex(rowData,"fourth_event",31,32)
                    });
                    //第4層地名
                    updatefourthAll(rowData[31], "third_all_event","fourth_all_event", function() {
                        // 第4層地名
                        setSelectedIndex(rowData,"fourth_all_event",33,34)
                    });
                });
            });
            
        });
    }

    document.getElementById("chome_event").value = rowData[35];//丁目
    document.getElementById("address_event").value = rowData[36];//番地
    document.getElementById("of1_event").value = rowData[37];//之
    document.getElementById("of2_event").value = rowData[38];//之
    //index
    document.getElementById("indexInput3").value = rowData[39];
}
//修改
function modifyHousehold3() {
    // 獲取 indexInput 的值
    var index3 = document.getElementById("indexInput3").value;
    var id2 = document.getElementById('id2').value; // 戶號
    var perno2 = document.getElementById('perno2').value; // 人號
    var rg3 = document.getElementById('rg3').value;  // 年號
    var rg3_ch = ""; 
    if (rg3){
        rg3_ch = document.getElementById('rg3').options[document.getElementById('rg3').selectedIndex].text; // 年號的文字
    }
    var yy3 = document.getElementById('yy3').value; //年
    var mm3 = document.getElementById('mm3').value; //月
    var dd3 = document.getElementById('dd3').value; //日
    var no3 = document.getElementById('no3').value; // 序號
    var event = document.getElementById('event').value; // 事件
    var event_ch = ""; 
    if (event){
        event_ch = document.getElementById('event').options[document.getElementById('event').selectedIndex].text; // 事件的文字
    }
    var type2Input = document.querySelector('input[name="type2"]:checked');// 本戶或他戶
    if (type2Input) {
        var type2 = type2Input.value; 
    } else {
        var type2 = ""; 
    }
    var relevant_person3 = document.getElementById('relevant_person3').value; // 關係人
    var relationInput = document.getElementById('relationInput').value; // 關係
    var relationInput_ch = ""; 
    if (relationInput){
        relationInput_ch = document.getElementById('relationInput').options[document.getElementById('relationInput').selectedIndex].text; // 關係的文字
    }

    var name2 = document.getElementById('name2').value; // 戶主
    var relationshipInput2 = document.getElementById('relationshipInput2').value; // 續柄
    var relationshipInput2_ch = ""; 
    if (relationshipInput2){
        relationshipInput2_ch = document.getElementById('relationshipInput2').options[document.getElementById('relationshipInput2').selectedIndex].text; // 續柄的文字
    }

    var rg_event = document.getElementById('rg_event').value;  // 年號
    var rg_event_ch = ""; 
    if (rg_event){
        rg_event_ch = document.getElementById('rg_event').options[document.getElementById('rg_event').selectedIndex].text; // 年號的文字
    }

    var first_event = document.getElementById('first_event').value;  // 1
    var first_event_ch = ""; 
    if (first_event){
        first_event_ch = document.getElementById('first_event').options[document.getElementById('first_event').selectedIndex].text;  // 第一層級別
    }
    var first_all_event_ch = ""; 
    if (document.getElementById('first_all_event').value){
        first_all_event_ch = document.getElementById('first_all_event').options[document.getElementById('first_all_event').selectedIndex].text; //第一層地名跟代碼
    }
    var second_event = document.getElementById('second_event').value;  // 2
    var second_event_ch = ""; 
    if (second_event){
        second_event_ch = document.getElementById('second_event').options[document.getElementById('second_event').selectedIndex].text;  // 第二層級別
    }
    var second_all_event_ch = ""; 
    if (document.getElementById('second_all_event').value){
        second_all_event_ch = document.getElementById('second_all_event').options[document.getElementById('second_all_event').selectedIndex].text; //第二層地名跟代碼
    }

    var third_event = document.getElementById('third_event').value;  // 3
    var third_event_ch = ""; 
    if (third_event){
        third_event_ch = document.getElementById('third_event').options[document.getElementById('third_event').selectedIndex].text;  // 第三層級別
    }
    var third_all_event_ch = ""; 
    if (document.getElementById('third_all_event').value){
        third_all_event_ch = document.getElementById('third_all_event').options[document.getElementById('third_all_event').selectedIndex].text; //第三層地名跟代碼
    }

    var fourth_event = document.getElementById('fourth_event').value;  // 4
    var fourth_event_ch = ""; 
    if (fourth_event){
        fourth_event_ch = document.getElementById('fourth_event').options[document.getElementById('fourth_event').selectedIndex].text;  // 第四層級別
    }
    var fourth_all_event_ch = ""; 
    if (document.getElementById('fourth_all_event').value){
        fourth_all_event_ch = document.getElementById('fourth_all_event').options[document.getElementById('fourth_all_event').selectedIndex].text; //第四層地名跟代碼
    }
    
    var chome_event = document.getElementById('chome_event').value;  // 丁目
    var address_event = document.getElementById('address_event').value;  // 番地
    var of1_event = document.getElementById('of1_event').value;  // 幾之
    var of2_event= document.getElementById('of2_event').value;  // 幾
    
    // 發送POST請求到指定的路徑'/generate-csv'
    fetch('/modify-eventForm-csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // 指定請求的內容類型為JSON
        },
        body: JSON.stringify({ id2:id2,perno2:perno2,rg3 : rg3,rg3_ch:rg3_ch , yy3 : yy3 , mm3 : mm3 , dd3 : dd3 , no3:no3,
            event: event,event_ch:event_ch,
            relevant_person3:relevant_person3,type2:type2,relationInput:relationInput,relationInput_ch:relationInput_ch,
            name2:name2,relationshipInput2:relationshipInput2,relationshipInput2_ch:relationshipInput2_ch,
            rg_event:rg_event,rg_event_ch:rg_event_ch,first_event:first_event,first_event_ch:first_event_ch,first_all_event_ch:first_all_event_ch,
            second_event:second_event,second_event_ch:second_event_ch,second_all_event_ch:second_all_event_ch,
            third_event:third_event,third_event_ch:third_event_ch,third_all_event_ch:third_all_event_ch,
            fourth_event:fourth_event,fourth_event_ch:fourth_event_ch,fourth_all_event_ch:fourth_all_event_ch,
            chome_event:chome_event,address_event:address_event,of1_event:of1_event,of2_event:of2_event,index3:index3
            }), // 將輸入的數字轉換為JSON格式並作為請求體發送
    })
    .then(response => response.json()) // 解析回應的JSON數據
    .then(data => {
        alert('事件修改成功!'); // 在產生CSV成功時彈出提示

        // 清除輸入框的值
        document.getElementById('id2').value = '';
        document.getElementById('perno2').value = '';
        document.getElementById('rg3').value = '';
        document.getElementById('yy3').value = '';
        document.getElementById('mm3').value = '';
        document.getElementById('dd3').value = '';
        document.getElementById('no3').value = '';
        document.getElementById('eventsearch').value = '';
        document.getElementById('event').value = '';
        document.getElementById('relevant_person3').value = '';
        var type2RadioButtons = document.querySelectorAll('input[name="type2"]');
        type2RadioButtons.forEach(function(radio) {
            radio.checked = false;
        });
        document.getElementById('relationsearch').value = '';
        document.getElementById('relationInput').value = '';
        document.getElementById('name2').value = '';
        document.getElementById('relationshipsearch2').value = '';
        document.getElementById('relationshipInput2').value = '';
        document.getElementById('rg_event').value = '';
        document.getElementById('first_event').value = '';
        document.getElementById('first_all_event').value = '';
        document.getElementById('second_event').value = '';
        document.getElementById('second_all_event').value = '';
        document.getElementById('third_event').value = '';
        document.getElementById('third_all_event').value = '';
        document.getElementById('fourth_event').value = '';
        document.getElementById('fourth_all_event').value = '';
        document.getElementById('chome_event').value= '';
        document.getElementById('address_event').value= '';
        document.getElementById('of1_event').value= '';
        document.getElementById('of2_event').value= '';
        document.getElementById('indexInput3').value= '';

    })
    .catch((error) => {
        console.error('Error:', error); //錯誤提醒
    });
}

//查詢特殊事件
function searchspecial() {
    // 獲取查詢的戶號
    var id4 = document.getElementById("id4").value;
  
    // 使用 fetch 加載文件
    fetch('special.csv')
        .then(response => response.text())
        .then(csvData => {
            // 讀取csv
            var data = parseCSV2(csvData);
  
            // 查找名字匹配的行
            var results = data.filter(function(row) {
                return row[0] === id4; // 戶號
            });
  
            // 顯示結果
            var resultDiv = document.getElementById("result4");
            if (results.length > 0) {
                var tableHtml = "<h3>查詢結果：</h3><table>";
                // 表頭
                tableHtml += "<tr>";
                tableHtml += "<th>修改</th>"; // 新增修改欄位
                for (var i = 0; i < data[0].length; i++) {
                    tableHtml += "<th>" + data[0][i] + "</th>";
                }
                tableHtml += "</tr>";
                // 表身
                for (var j = 0; j < results.length; j++) {
                    tableHtml += "<tr>";
                    // 修改欄位及單選框
                    tableHtml += "<td><input type='radio' name='modify' onclick='fillInputs4(" + JSON.stringify(results[j]) + ")'></td>";
                    for (var i = 0; i < results[j].length; i++) {
                        tableHtml += "<td>" + results[j][i] + "</td>";
                    }
                    tableHtml += "</tr>";
                }
                tableHtml += "</table>";
                resultDiv.innerHTML = tableHtml;

            } else {
                resultDiv.innerHTML = "<p>找不到相符的資料。</p>";
            }
        })
        .catch(error => {
            console.error('Error loading CSV file:', error);
        });
}
// 將 CSV 欄位的內容回填到 HTML 表單的輸入框中
function fillInputs4(rowData) {
    // 先隱藏所有欄位
    var hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(function(element) {
        element.classList.remove('hidden');
    });
    document.getElementById("id4").value = rowData[0]; //戶號
    document.getElementById("perno4").value = rowData[1]; //人號
    document.getElementById("special_event").value = rowData[2]; //特殊情況
    //index
    document.getElementById("indexInput4").value = rowData[3];

}
//修改
function modifyHousehold4() {
    // 獲取 indexInput 的值
    var index4 = document.getElementById("indexInput4").value;
    var id4 = document.getElementById('id4').value; // 戶號
    var perno4 = document.getElementById('perno4').value; // 人號
    var special_event = document.getElementById('special_event').value; // 特殊情況
    // 發送POST請求到指定的路徑'/generate-csv'
    fetch('/modify-specialForm-csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // 指定請求的內容類型為JSON
        },
        body: JSON.stringify({ id4:id4,perno4:perno4,special_event : special_event,index4:index4
            }), // 將輸入的數字轉換為JSON格式並作為請求體發送
    })
    .then(response => response.json()) // 解析回應的JSON數據
    .then(data => {
        alert('特殊情況修改成功!'); // 在產生CSV成功時彈出提示

        // 清除輸入框的值
        document.getElementById('id4').value = '';
        document.getElementById('perno4').value = '';
        document.getElementById('special_event').value = '';
        document.getElementById('indexInput4').value = '';

    })
    .catch((error) => {
        console.error('Error:', error); //錯誤提醒
    });
}
  
// 讀取csv
function parseCSV2(csvData) {
var rows = csvData.split('\n');
var result = [];
for (var i = 0; i < rows.length; i++) {
    var columns = rows[i].split(',');
    result.push(columns);
}
return result;
}

// 更改背景顏色
function changeBackgroundColor(color) {
    var memberForm = document.getElementById('memberForm');
    memberForm.style.backgroundColor = color;
}

//背景顏色根據性別變色
document.addEventListener('DOMContentLoaded', function () {
    // 獲取性別元素
    var maleRadio = document.getElementById('male');
    var femaleRadio = document.getElementById('female');

    // 確保元素存在再添加事件監聽器
    if (maleRadio) {
        maleRadio.addEventListener('change', function () {
            changeBackgroundColor('#caf0f8');
        });
    }

    if (femaleRadio) {
        femaleRadio.addEventListener('change', function () {
            changeBackgroundColor('#ffe5ec');
        });
    }
});

function changeBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}

// 禁用enter提交
//function preventFormSubmit(formId) {
    // 監聽指定表單的 keypress 事件
//    document.getElementById(formId).addEventListener("keypress", function(event) {
        // 檢查按下的鍵是否為 Enter 鍵 (keyCode 為 13)
//        if (event.keyCode === 13) {
            // 阻止預設的表單提交行為
//            event.preventDefault();
            // 阻止進一步的事件傳播
//            return false;
//        }
//    });
//}
function preventFormSubmit(formId) {
    // 嘗試獲取表單元素
    const formElement = document.getElementById(formId);
    
    // 如果表單元素存在，則添加事件監聽器
    if (formElement) {
        formElement.addEventListener("keypress", function(event) {
            // 檢查按下的鍵是否為 Enter 鍵 (keyCode 為 13)
            if (event.keyCode === 13) {
                // 阻止預設的表單提交行為
                event.preventDefault();
                // 阻止進一步的事件傳播
                return false;
            }
        });
    }
}

// 對每個表單調用函數來設置 keypress 事件監聽器
preventFormSubmit("householdForm");
preventFormSubmit("memberForm");
preventFormSubmit("eventForm");
preventFormSubmit("specialForm");
  

//事件隱藏欄位
document.addEventListener('DOMContentLoaded', function() {
    var eventDropdown = document.getElementById('event');
    var relationFields = document.getElementById('relationFields');
    var otherhouse = document.getElementById('otherhouse');
    var where = document.getElementById('where');

    // 確保元素存在，避免 'null' 錯誤
    if (eventDropdown && relationFields && otherhouse && where) {
        eventDropdown.addEventListener('change', function() {
            if (eventDropdown.value === '102'|| eventDropdown.value === '103' || eventDropdown.value === '104'|| eventDropdown.value === '105'|| eventDropdown.value === '106'
            || eventDropdown.value === '204'|| eventDropdown.value === '205'|| eventDropdown.value === '307'|| eventDropdown.value === '310'|| eventDropdown.value === '406'|| eventDropdown.value === '414'
            || eventDropdown.value === '805'|| eventDropdown.value === '806'|| eventDropdown.value === '807'|| eventDropdown.value === '808'|| eventDropdown.value === '809'|| eventDropdown.value === '810'
            || eventDropdown.value === '901'|| eventDropdown.value === '902'|| eventDropdown.value === '906') { //0
                clearAndHide(relationFields);
                clearAndHide(otherhouse);
                clearAndHide(where);
            } else if (eventDropdown.value === '203'|| eventDropdown.value === '208'|| eventDropdown.value === '210'|| eventDropdown.value === '211'|| eventDropdown.value === '301'|| eventDropdown.value === '302'
            || eventDropdown.value === '401'|| eventDropdown.value === '503'|| eventDropdown.value === '504'|| eventDropdown.value === '523'|| eventDropdown.value === '517'|| eventDropdown.value === '518') { //1
                relationFields.style.display = 'block';  // 根據需求，這裡可能需要調整顯示還是隱藏
                clearAndHide(otherhouse);
                clearAndHide(where);        // 隱藏 where 元素
            } else if (eventDropdown.value === '101'|| eventDropdown.value === '201'|| eventDropdown.value === '601'|| eventDropdown.value === '603'
            || eventDropdown.value === '803'|| eventDropdown.value === '811') { //2
                clearAndHide(relationFields);
                clearAndHide(otherhouse);    
                where.style.display = 'block';            
            }else if (eventDropdown.value === '202'||eventDropdown.value === '206'||eventDropdown.value === '207'||eventDropdown.value === '209'|| eventDropdown.value === '308'|| eventDropdown.value === '309'|| eventDropdown.value === '407'|| eventDropdown.value === '413'|| eventDropdown.value === '408'|| eventDropdown.value === '501'
            || eventDropdown.value === '502'|| eventDropdown.value === '514'|| eventDropdown.value === '505'|| eventDropdown.value === '507'|| eventDropdown.value === '515'|| eventDropdown.value === '516'
            || eventDropdown.value === '510'|| eventDropdown.value === '511'|| eventDropdown.value === '512'|| eventDropdown.value === '513'|| eventDropdown.value === '801'|| eventDropdown.value === '802'
            || eventDropdown.value === '903'|| eventDropdown.value === '904'|| eventDropdown.value === '905') { //6
                clearAndHide(relationFields);
                otherhouse.style.display = 'block';       
                where.style.display = 'block';            
            }else {
                relationFields.style.display = 'block';
                otherhouse.style.display = 'block';
                where.style.display = 'block';
            }
        });
    }
    // 清除元素內部值的輔助函數 避免修改事件後其他欄位自動隱藏無法刪除卻被送出
    function clearAndHide(element) {
        // 清除所有子元素的值
        var inputs = element.querySelectorAll('input, textarea, select');
        inputs.forEach(function(input) {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
        // 隱藏元素
        element.style.display = 'none';
    }
});

//生命歷程
function searchRelationship() {
    // 獲取查詢的名字
    var inputName = document.getElementById("inputName").value;
  
    // 使用 fetch 加載文件
    fetch('person.csv')
        .then(response => response.text())
        .then(csvData => {
            // 讀取csv
            var data = parseCSV(csvData);
  
            // 查找人號匹配的行
            var result = data.find(function(row) {
                return row[1] === inputName; // 人號
            });
  
            if (result) {
                // 獲取姓名
                var personName = result[3];
                var personInfo = {
                    id: personName, 
                    type: 'person',
                    pid: result[1], // 人號
                    name: result[3], // 姓名
                    reign: result[10], // 年號
                    yy: result[11], // 年
                    mm: result[12], // 月
                    dd: result[13], // 日
                    father: result[14], // 爸爸
                    mother: result[15], // 媽媽
                    porder: result[17], // 出生別
                    gender: result[8], // 性別
                };
                
                // 使用 fetch 加載 event.csv
                fetch('event.csv')
                    .then(response => response.text())
                    .then(eventCsvData => {
                        // 讀取csv
                        var eventData = parseCSV(eventCsvData);

                        // 查找所有與 PID 相關的事件
                        var matchingEvents = eventData.filter(function(row) {
                            return row[1] === inputName; // 人號
                        });

                        if (matchingEvents.length > 0) {
                            // 初始化 Cytoscape
                            var elements = [
                                { data: personInfo }
                            ];

                            matchingEvents.forEach(function(eventRow) {
                                var event = eventRow[9]; // 事件
                                var relationName = eventRow[10]; // 事件關係人姓名
                                var rela = eventRow[13]; // 與事件本人關係
                                var no7 = eventRow[7]; // 事件序次
                                var uniqueEventId = event + '-' + no7; // 生成唯一事件ID

                                elements.push({ data: { id: uniqueEventId  , type: 'event',label: event,relatedno: eventRow[7], relarg: eventRow[3], relayy: eventRow[4],relamm: eventRow[5],reladd: eventRow[6]} });
                                //elements.push({ data: { id: 'event-' + uniqueEventId , source: uniqueEventId , target: personName, label:"事件" } });
                                elements.push({ data: { id: 'event-' + uniqueEventId, source: uniqueEventId, target: personName, label: no7 } });

                                if (relationName && relationName.trim() !== "") {
                                    elements.push({ data: { id: relationName , type: 'relation'} });
                                    elements.push({ data: { id: 'relation-' + relationName, source: relationName, target: uniqueEventId, label: rela } });
                                }
                            });

                            initializeCytoscape(elements, personInfo);
                        } else {
                            console.error("找不到相符的事件資料。");
                        }
                    })
                    .catch(error => {
                        console.error('載入 event.csv 時發生錯誤:', error);
                    });

            } else {
                console.error("找不到相符的資料。");
            }
        })
        .catch(error => {
            console.error('Error loading CSV file:', error);
        });
  }
  
  // 讀取csv
  function parseCSV(csvData) {
    var rows = csvData.split('\n');
    var result = [];
    for (var i = 0; i < rows.length; i++) {
        var columns = rows[i].split(',');
        result.push(columns);
    }
    return result;
  }
  
  // 修改 Cytoscape 初始化部分
  function initializeCytoscape(elements, personInfo) {
    var cy = window.cy = cytoscape({
      container: document.getElementById('cy'),
      
      elements: elements,
      style: [
          {
              selector: 'node',
              style: {
                  'label': 'data(id)',
                  'text-valign': 'center',
              }
          },
          {
              selector: 'edge',
              style: {
                  'label': 'data(label)',
                  'curve-style': 'bezier',
                  'target-arrow-shape': 'triangle',
                  'width': 2,
                  'line-color': '#ccc',
                  'font-size': '10px' // 將字體大小設置為10像素
              }
          },
          {
            selector: 'node[type="person"]',
            style: {
                'background-color': '#edafb8',
                'label': 'data(id)',
                'text-valign': 'center'
            }
          },
          {
            selector: 'node[type="event"]', // 事件節點
            style: {
                'label': 'data(label)', // 使用 label 作為顯示文字
                'background-color': '#95bdb9', // 設置事件節點為藍色
            }
          },
          {
            selector: 'node[type="relation"]',// 關係人節點
            style: {
                'background-color': '#f2cc8f', // 設置關係人節點為黃色
            }
          }
          
      ],
      layout: {
          name: 'cose',
      }
    });
    // Tooltip 顯示邏輯
    var tooltip = document.getElementById('tooltip');

    cy.on('mouseover', 'node', function(event) {
        var node = event.target;
        var nodeData = node.data();
        
        if (nodeData.type === 'person') {
            // 顯示人員信息
            tooltip.innerHTML = `人號: ${nodeData.pid}<br>姓名: ${nodeData.name}<br>生日: ${nodeData.reign}${nodeData.yy}年${nodeData.mm}月${nodeData.dd}日<br>性別: ${nodeData.gender}<br>父親: ${nodeData.father}<br>母親: ${nodeData.mother}<br>出生別: ${nodeData.porder}`;
        }else if (nodeData.type === 'event') {
            // 顯示事件信息
            tooltip.innerHTML = `事件序次: ${nodeData.relatedno}<br>事件日期: ${nodeData.relarg}${nodeData.relayy}年${nodeData.relamm}月${nodeData.reladd}日`;
        } else {
            // 顯示節點 ID
            tooltip.innerHTML = node.id();
        }

        tooltip.style.display = 'block';
        var position = node.renderedPosition();
        tooltip.style.left = (position.x + 10) + 'px'; // 在節點右邊顯示
        tooltip.style.top = (position.y + 10) + 'px'; // 在節點下方顯示
    });

    cy.on('mouseout', 'node', function() {
        tooltip.style.display = 'none';
    });
  };

  // 刪除戶冊
  function deleteRow_house(id) {
    var ID3 = id[48];
    fetch('/api/house/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: ID3 // 將鍵名改為 id
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('刪除成功');
            } else {
                alert('Error deleting row: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting row:', error);
        });
}


  // 刪除成員
  function deleteRow_member(id) {
    var ID2 = id[37];
    fetch('/api/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: ID2 // 將鍵名改為 id
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('刪除成功');
            } else {
                alert('Error deleting row: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting row:', error);
        });
}

// 刪除事件
function deleteRow_event(id) {
    var ID = id[39];
    fetch('/api/event/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: ID // 將鍵名改為 id
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('刪除成功');
            } else {
                alert('Error deleting row: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting row:', error);
        });
}