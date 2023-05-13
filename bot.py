from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import NoSuchElementException
import time,os
from selenium.webdriver.chrome.options import Options


home_dir = os.path.expanduser("~")


class WaSender:
     
    instance_num = 0
        
    def __init__(self):
        
        self.id = WaSender.instance_num
        self.nums = []
        self.msg = ""
        self.file = ""
        self.logs = []
        self.label = "-"
        self.status = "-"

        self.errors = []
        self.sent = []
        
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-infobars")
        options.add_argument("--disable-extensions")
        options.add_argument(
            f"user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"
        )
        options.add_argument("user-agent=User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36")

        self.driver =  webdriver.Chrome(home_dir+"/chromedriver", options=options)
        self.driver.get("https://web.whatsapp.com/")

        WaSender.instance_num += 1

        self.init_wait = WebDriverWait(self.driver, 15)
        self.wait = WebDriverWait(self.driver, 40)
    

    def screenshot(self):
        return( self.driver.get_screenshot_as_base64() )
    

    def ping(self):
        for i in range(10):
            self.driver.get("https://web.whatsapp.com/")
            print(f"instance {self.id} got {i}th tick")


    def start_messaging(self):

        print("starting messaging")
        self.status = "Sending messages"
        # Iterate excel rows till to finish
        for mob in self.nums:

            # Assign customized message
            sent = self.sent
            errors = self.errors
            
            if(mob.strip()!="+918094011162" and (mob.strip() in sent or mob.strip() in errors) ):
                print(f"Already Sent -->  {mob}")
                continue

            
            self.driver.get(f"https://web.whatsapp.com/send?phone={mob.strip()}")
            
            try:
                error_box = self.init_wait.until( lambda driver: driver.find_element_by_xpath("// div[contains(text(),'Phone number shared via url is invalid.')]"))
                print(f"OPEN ERROR -- > {mob}")
                self.logs.append(f"OPEN ERROR -- > {mob}")

                self.errors.append(mob)
                continue
            except:
                pass
            
            try:
                # Locate attachment button through x_path
                clip_button = self.init_wait.until( lambda driver: driver.find_element_by_css_selector("span[data-icon='clip']"))

                
                ##Sending Attachments
                image_xpath = '//*[@id="main"]/footer/div[1]/div/span[2]/div/div[1]/div[2]/div/span/div/div/ul/li[1]/button/input'
                doc_xpath = "/html/body/div[1]/div[1]/div[1]/div[4]/div[1]/footer/div[1]/div/span[2]/div/div[1]/div[2]/div/span/div[1]/div/ul/li[4]/button/input"

                img = home_dir+f"/wa_sender/static/{self.file}"
                doc = home_dir+"/wa_sender/static/brochure.pdf"

                #send image
                clip_button.click()
                time.sleep(0.5)
                self.driver.find_element_by_xpath(image_xpath).send_keys(img)
                send_button = self.wait.until( lambda driver: driver.find_element_by_css_selector(".g0rxnol2"))
                
                time.sleep(1.5)

                for line in self.msg.split('\n'):
                    ActionChains(self.driver).send_keys(line).perform()
                    ActionChains(self.driver).key_down(Keys.SHIFT).key_down(Keys.ENTER).key_up(Keys.SHIFT).key_up(Keys.ENTER).perform()        
                
                time.sleep(1.2)
                ActionChains(self.driver).send_keys(Keys.RETURN).perform()

                # #send Document
                # time.sleep(1)
                # clip_button = self.init_wait.until( lambda driver: driver.find_element_by_css_selector("span[data-icon='clip']"))
                # clip_button.click()
                # time.sleep(0.3)
                # self.driver.find_element_by_xpath(doc_xpath).send_keys(doc)
                # send_button = self.wait.until( lambda driver: driver.find_element_by_css_selector("._1w1m1"))
                # send_button.click()

                time.sleep(9)

                print(f"sent ---> {mob}")
                self.logs.append(f"sent ---> {mob}")

                self.sent.append(mob)
            
            except Exception as e:
                print(f"MJR ERROR : {str(e)} -- > {mob}")
                self.logs.append(f"MJR ERROR : {str(e)} -- > {mob}")

                self.errors.append(mob)

        self.status = "Sending Complete"
