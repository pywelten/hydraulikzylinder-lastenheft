"""Visueller Smoke-Test ohne Dateisystem-/localhost-Navigation (Sandbox-Browsersperre)."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re
import os, tempfile
output=Path(os.getenv("LH_TEST_OUT", tempfile.gettempdir())) / "lhz-browser-smoke"
output.mkdir(parents=True,exist_ok=True)
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
html=re.sub(r'<script\s+src="[^"]+"\s+defer></script>','',html)
html=re.sub(r'<link\s+rel="stylesheet"[^>]+>','',html)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000},accept_downloads=True)
    errors=[]
    page.on('pageerror',lambda err: errors.append(str(err)))
    page.set_content(html)
    page.evaluate('''() => {let memory={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:(k)=>Object.hasOwn(memory,k)?memory[k]:null,setItem:(k,v)=>{memory[k]=String(v)},removeItem:(k)=>{delete memory[k]}}});}''')
    def load_app():
        for css in ['css/style.css','css/print.css']:
            page.add_style_tag(content=(root/css).read_text())
        for js in ['data','calculations','validation','storage','app']:
            page.add_script_tag(content=(root/'js'/f'{js}.js').read_text())
    load_app()
    page.wait_for_timeout(200)
    print('Title:',page.title())
    print('Heading:',page.locator('h1').first.inner_text())
    print('Sections:',page.locator('.nav-item').count())
    assert page.locator('.nav-item').count()==11
    page.screenshot(path=str(output/'hydraulikzylinder_desktop_preview.png'),full_page=True)
    page.locator('#i_pressure').fill('200')
    page.locator('#i_requiredPush').fill('90000')
    page.locator('#i_forceSafety').fill('1,5')
    page.locator('[data-nav="cylinder"]').click()
    page.locator('[data-card-value="Doppeltwirkender Differentialzylinder"]').click()
    page.locator('[data-card-value="Horizontal"]').click()
    page.locator('[data-nav="dimensions"]').click()
    page.locator('#i_pistonDiameter').fill('100')
    page.locator('#i_rodDiameter').fill('60')
    page.locator('#i_stroke').fill('500')
    page.screenshot(path=str(output/'hydraulikzylinder_drawing_preview.png'),full_page=True)
    page.locator('[data-nav="summary"]').click()
    print('Force display:',page.locator('.metric').first.inner_text())
    assert '157.079,63' in page.locator('.metric').first.inner_text()
    page.screenshot(path=str(output/'hydraulikzylinder_summary_preview.png'),full_page=True)
    with page.expect_download() as d:
        page.locator('#summaryExport').click()
    download=d.value
    download.save_as(str(output/'hydraulikzylinder_smoketest.json'))
    print('Download:',download.suggested_filename)
    # erneutes Rendern wie nach einem Refresh, inklusive LocalStorage
    page.set_content(html)
    load_app()
    page.locator('[data-nav="dimensions"]').click()
    assert page.locator('#i_pistonDiameter').input_value()=='100'
    print('Persistence reloaded: yes')
    page.locator('#btnSave').click()
    page.locator('#saveName').fill('Browser Test')
    page.locator('#saveForm button[value="ok"]').click()
    page.locator('#btnManage').click()
    assert 'Browser Test' in page.locator('#savedList').inner_text()
    page.locator('#manageDialog [data-close-dialog]').click()
    print('Named save works')
    page.locator('[data-nav=equipment]').click()
    page.locator('#i_hasTravelSensor').check()
    assert page.locator('#i_travelSignal').is_visible()
    page.locator('#i_hasEndCushionBase').check()
    assert page.locator('#i_movingMass').is_visible()
    page.locator('[data-nav=ports]').click()
    page.locator('[data-angle-range=portRodAngle]').fill('90')
    assert page.locator('#i_portRodAngle').input_value()=='90'
    print('Conditional fields and angle selector: yes')
    # window.print durch verifizierbaren Stub ersetzen (PDF via page.pdf)
    page.evaluate('window.print = () => window.__printRequested = true')
    page.locator('#btnPrint').click()
    assert page.evaluate('window.__printRequested === true')
    assert 'Lastenheft für Zylinderanfragen' in page.locator('#printRoot').inner_text()
    print('Print sections:',page.locator('#printRoot .print-section').count())
    page.emulate_media(media='print')
    page.pdf(path=str(output/'hydraulikzylinder_drucktest.pdf'),format='A4',print_background=True)
    page.emulate_media(media='screen')
    print('JS errors:',errors)
    assert not errors,errors
    page.set_viewport_size({'width':390,'height':844})
    page.set_content(html)
    load_app()
    page.wait_for_timeout(400)
    page.screenshot(path=str(output/'hydraulikzylinder_mobile_preview.png'),full_page=True)
    print('Body scrollwidth',page.evaluate('document.documentElement.scrollWidth'),'screen',page.evaluate('window.innerWidth'))
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
    page.locator('#menuToggle').click()
    assert page.locator('#sidebar').evaluate('(el)=>el.classList.contains("open")')
    print('Mobile navigation: yes; horizontal overflow: no')
    browser.close()
