let $tool = init();
TOKEN = $tool.read('oa-token');
const dtc = loadThisDate('.');
const host_url = 'http://oa.scctyl.com:8011';
const isRequest = typeof $request != 'undefined';
if(isRequest){
    getSession();
}else {
    getInfo();
}
function getInfo() {
    let url = host_url + '/pda/attendance/sign/data.php?action=getdayinfo';
    let headers = {
        'Accept-Encoding': 'gzip, deflate, br',
        'Cookie': TOKEN,
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'Host': 'oa.scctyl.com',
        'User-Agent': 'NewTongDaOA/ ' + dtc + '(iPhone; iOS 13.5; Scale/2.00)',
        'Accept-Language': 'zh-Hans-CN;q=1, en-US;q=0.9'
    };
    let request1 = {
        url: url,
        headers: headers,
        body: ''
    };
    $tool.post(request1, (error, response, d) => {
        console.log('getInfo-Data:' + d);
        try{
            let res = JSON.parse(d);
            if(res.dutyname === '正常班'){
                let hrs = new Date().getHours();
                let mis = new Date().getMinutes();
                let zbk = res.attend_list[0].register_time;
                let wbk = res.attend_list[1].register_time;
                if(hrs>7&&hrs<17&&zbk){
                    $tool.msg('打卡提醒','早班卡未打','打卡时间为|'+zbk);
                }else if(hrs===17&&wbk&&mis>=30){
                    $tool.msg('打卡提醒','下班卡未打','打卡时间为|'+wbk);
                }else if(hrs>17&&wbk){
                    $tool.msg('打卡提醒','下班卡未打','打卡时间为|'+wbk);
                }
            }
        }catch (e){
            $tool.msg('打卡提醒','token有问题,你可能没有打卡','');
        }
        $tool.done();
    });
}
function getSession(){
    let header = $request.headers;
    let token = header.Cookie;
    $tool.write(token,'oa-token');
    $tool.done();
}
function loadThisDate(t) {
    let date = new Date();
    let MM = date.getMonth() + 1;
    let y = date.getFullYear();
    MM = MM < 10 ? ('0' + MM) : MM;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + t + MM + t + d;
}
function init() {
    const isSurge = typeof $httpClient != "undefined";
    const isQuanX = typeof $task != "undefined";
    const read = (key) => {
        if (isSurge) return $persistentStore.read(key);
        if (isQuanX) return $prefs.valueForKey(key);
    }
    const write = (key, val) => {
        if (isSurge) return $persistentStore.write(key, val);
        if (isQuanX) return $prefs.setValueForKey(key, val);
    }
    const msg = (title, subtitle, body) => {
        if (isSurge) $notification.post(title, subtitle, body);
        if (isQuanX) $notify(title, subtitle, body);
    }
    const log = (message) => console.log(message)
    const get = (url, cb) => {
        if (isSurge) {
            $httpClient.get(url, cb)
        }
        if (isQuanX) {
            url.method = 'GET'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    const post = (url, cb) => {
        if (isSurge) {
            $httpClient.post(url, cb)
        }
        if (isQuanX) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    const put = (url, cb) => {
        if (isSurge) {
            $httpClient.put(url, cb)
        }
        if (isQuanX) {
            url.method = 'PUT'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    const done = (value = {}) => {
        $done(value)
    }
    return { isSurge, isQuanX, msg, log, read, write, get, post, put, done }
}
