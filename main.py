import hashlib
import hmac
import re
import requests
from urllib.parse import parse_qs
import random
import time
import execjs
from ddddocr import DdddOcr
from requests.utils import dict_from_cookiejar


class GGError(Exception):
    pass


def get_passwd_ruledetail():
    headers = {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "origin": "https://upass.10jqka.com.cn",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": "https://upass.10jqka.com.cn/",
        "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    }
    url = "https://s.thsi.cn/pwdRangeCalcRegular.json"
    response = requests.get(url, headers=headers)
    print(response.json())
    return response.json()['data']['ruleDetail']


def sha256(string):
    # 创建一个 SHA-256 哈希对象
    sha256_hash = hashlib.sha256()

    # 更新哈希对象的内容（可以分多次更新）
    sha256_hash.update(string.encode('utf-8'))

    # 获取哈希结果（十六进制字符串）
    hash_result = sha256_hash.hexdigest()
    return hash_result


def get_crnd():
    return ''.join(random.choices('0123456789abcdefghijklmnopqrstuvwxyz', k=8)) + ''.join(
        random.choices('0123456789abcdefghijklmnopqrstuvwxyz', k=8))


def get_timestamp():
    return int(time.time())


def str_md5(target: str):
    """字符串进行MD5加密"""
    obj = hashlib.md5()
    obj.update(target.encode("utf-8"))
    return obj.hexdigest()


def hamc_256(key, message):
    key = key.encode('utf-8')
    message = message.encode('utf-8')
    hmac_sha256 = hmac.new(key, message, hashlib.sha256)
    hmac_result = hmac_sha256.hexdigest()
    # print("HMAC-SHA256 结果:", hmac_result)
    return hmac_result


def get_random():
    current_time = time.time() * 1000
    random_value = random.random()
    result = random_value * current_time
    return result


class TongHuaShunLogin:
    headers = {
        "Accept": "*/*",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Pragma": "no-cache",
        "Referer": "https://upass.10jqka.com.cn/",
        "Sec-Fetch-Dest": "script",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "same-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\""
    }

    def __init__(self, user, password):
        self.user, self.password = user, password

        self.session = requests.Session()
        with open('./加密.js', 'r', encoding='utf-8') as f:
            self.js_content = f.read()
        with open('./v_new.js', 'r', encoding='utf-8') as f:
            self.hexin_v = f.read()
        with open('./encrypt.js', 'r', encoding='utf-8') as f:
            self.encrypt = f.read()
        with open('./passwd_check.js', 'r', encoding='utf-8') as f:
            self.passwd_check = f.read()
        self.dct = DdddOcr(ocr=False, show_ad=False)

    def get_pubkey(self):
        url = "https://upass.10jqka.com.cn/common/getFingerprintRsaInfo?"
        response = self.session.get(url, headers=self.headers)
        return response.json()['pubkey']

    def generate(self):
        collections = execjs.compile(self.js_content).call('get_collections', self.get_pubkey())
        url = "https://hawkeye.10jqka.com.cn/v1/hawkeye/generate"
        data = {
            "pass_code": "",
            "user_id": "null",
            "source_type": "web",
            "collections": collections,
            "protocol": "fingerprint_1"
        }
        response = self.session.post(url, headers=self.headers, cookies=self.get_v(), data=data)
        print(response.text)
        # print(response)
        return response.json()

    def set_device_cookie(self):
        msg = self.generate()
        pass_code, expires_time, device_code = msg['data']['pass_code'], msg['data']['expires_time'], msg['data'][
            'device_code']
        url = "https://upass.10jqka.com.cn/common/setDeviceCookie"
        data = {
            "u_dpass": pass_code,
            "u_did": device_code,
            "u_uver": "1.0.0",
            "expires_time": expires_time
        }
        v = self.get_v()
        self.session.cookies.set('v', v['v'])
        self.headers.update({'hexin-v': v['v']})
        response = self.session.post(url, headers=self.headers, data=data)
        return dict_from_cookiejar(response.cookies)

    def get_pre_handle(self):
        url = "https://captcha.10jqka.com.cn/getPreHandle"
        params = {
            "captcha_type": "4",
            "appid": "registernew",
            "random": get_random(),
            "callback": "PreHandle"
        }
        response = self.session.get(url, headers=self.headers, cookies=self.get_v(), params=params)
        url_params = ''.join(re.findall(r'urlParams":"(.*?)"', response.text))
        imgs = ''.join(re.findall(r'"imgs":(.*?),"initx', response.text))
        params = parse_qs(url_params)
        # rand,sign=''.join(params['rand']),''.join(params['signature'])
        # print(params, imgs, sep='\n')
        return params, imgs

    def ddd_img(self, params, imgs):
        print(params, imgs, type(imgs))
        headers = {
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://upass.10jqka.com.cn/",
            "Sec-Fetch-Dest": "image",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        for index, img in enumerate(imgs):
            url = "https://captcha.10jqka.com.cn/getImg"
            params = {
                "rand": ''.join(params['rand']),
                "time": ''.join(params['time']),
                "appid": "registernew",
                "captcha_type": "4",
                "signature": ''.join(params['signature']),
                "iuk": img
            }
            response = self.session.get(url, headers=headers, params=params)
            #
            # print(response.text)
            imgs[index] = response.content
            # with open(f'{index}.png', 'wb') as f:
            #     f.write(response.content)
        res = self.dct.slide_match(imgs[1], imgs[0], simple_target=True)
        return res['target']

    def get_ticket(self, p, x, y):
        url = "https://captcha.10jqka.com.cn/getTicket"
        y = y / 195 * 177.22058823529412
        phrase = f"{int(x * 0.908)};{y};309;177.22058823529412"
        params = {
            "rand": ''.join(p['rand']),
            "time": ''.join(p['time']),
            "appid": "registernew",
            "captcha_type": "4",
            "signature": ''.join(p['signature']),
            "phrase": phrase,
            "callback": "verify"
        }
        v = self.get_v()
        self.session.cookies.set('v', v['v'])
        self.headers.update({'hexin-v': v['v']})

        response = self.session.get(url, headers=self.headers, params=params)
        print(response.text)
        ticket = ''.join(re.findall(r'"ticket":"(.*?)"', response.text))
        if ticket:
            return ticket, phrase
        else:
            print('滑块校验失败>', response.text)
            return None, None

    def get_gs(self, crnd=None):
        url = "https://upass.10jqka.com.cn/user/getGS"
        uname = execjs.compile(self.encrypt).call('rsa', self.user)
        crnd = get_crnd() if not crnd else crnd
        data = {
            "uname": uname,
            "rsa_version": "default_4",
            "crnd": crnd
        }
        v = self.get_v()
        self.session.cookies.set('v', v['v'])
        self.headers.update({'hexin-v': v['v']})
        response = self.session.post(url, headers=self.headers, data=data)

        print(response.text)
        return response.json(), crnd

    def get_passwd_salt(self, gs, crnd):
        dsv, ssv, dsk = gs['dsv'], gs['ssv'], gs['dsk']
        # ssv_base64_decode = base64.b64decode(ssv)
        crnd_dsk_sha256 = sha256(crnd + dsk)
        n = execjs.compile(self.encrypt).call('get_passwdSalt', ssv, crnd_dsk_sha256)
        hamc_result = hamc_256(n, str_md5(self.password))
        dsv_sha256 = sha256(dsv)
        result = execjs.compile(self.encrypt).call('get_passwdSalt2', hamc_result, dsv_sha256)
        # print(result)
        return result

    def get_v(self):
        return {'v': execjs.compile(self.hexin_v).call('get_v')}

    def start(self):
        if self.session.cookies: self.session.cookies.clear()
        self.set_device_cookie()
        upwd_score = execjs.compile(self.passwd_check).call('calculatePasswordScore', self.password)
        gs, crnd = self.get_gs()
        v1 = self.get_v()
        self.session.cookies.set('v', v1['v'])
        self.headers.update({'hexin-v': v1['v']})
        data = {
            "uname": execjs.compile(self.encrypt).call('rsa', self.user),
            "passwd": execjs.compile(self.encrypt).call('rsa', str_md5(self.password)),
            "saltLoginTimes": "1",
            "longLogin": "on",
            "rsa_version": "default_4",
            "source": "pc_web",
            "request_type": "login",
            "captcha_type": "4",
            "upwd_score": upwd_score,
            "ignore_upwd_score": "",
            "passwdSalt": self.get_passwd_salt(gs=gs, crnd=crnd),
            "dsk": gs['dsk'],
            "crnd": crnd,
            "ttype": "WEB",
            "sdtis": "C22",
            "timestamp": get_timestamp()
        }
        response = self.session.post("https://upass.10jqka.com.cn/login/dologinreturnjson2", headers=self.headers,
                                     data=data)
        if response.json()['errorcode'] != -11400:
            GGError(f'第一次未带验证码校验出现未知情况>>{response.json()}')
        gs, crnd = self.get_gs(crnd=crnd)
        while 1:
            params, imgs = self.get_pre_handle()
            target = self.ddd_img(params, eval(imgs))
            time.sleep(2)
            ticket, phrase = self.get_ticket(params, target[0], target[1])
            if ticket: break
        v2 = self.get_v()
        self.session.cookies.set('v', v2['v'])
        self.headers.update({'hexin-v': v2['v']})
        data = {
            "uname": execjs.compile(self.encrypt).call('rsa', self.user),
            "passwd": execjs.compile(self.encrypt).call('rsa', str_md5(self.password)),
            "saltLoginTimes": "1",
            "longLogin": "on",
            "rsa_version": "default_4",
            "source": "pc_web",
            "request_type": "login",
            "captcha_type": "4",
            "captcha_phrase": phrase,
            "captcha_ticket": ticket,
            "captcha_signature": ''.join(params['signature']),
            "upwd_score": upwd_score,
            "ignore_upwd_score": "",
            "passwdSalt": self.get_passwd_salt(gs=gs, crnd=crnd),
            "dsk": gs['dsk'],
            "crnd": crnd,
            "ttype": "WEB",
            "sdtis": "C22",
            "timestamp": get_timestamp()
        }
        headers = {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://upass.10jqka.com.cn",
            "Pragma": "no-cache",
            "Referer": "https://upass.10jqka.com.cn/login?redir=HTTP_REFERER",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
            "hexin-v": v2['v'],
            "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        response = self.session.post("https://upass.10jqka.com.cn/login/dologinreturnjson2", headers=headers, data=data)
        print(response.json())
        print(response.cookies)
        if response.json()['errorcode'] == -10510:
            raise GGError('需要手机验证码了')
        elif response.json()['errorcode'] == -11032 and response.json().get('dsk'):
            raise GGError('需要重新发一次登录的包,暂未配置')
        elif response.json()['errorcode'] == 0 and response.json()['errormsg']=='成功':
            cookies = self.session.cookies
            if cookies.get('v'): del cookies['v']
            return dict_from_cookiejar(cookies)
        else:
            raise GGError(f'未知情况>>{response.json()}')


if __name__ == '__main__':
    TongHuaShunLogin(user='xxxxx', password='xxxxx').start()