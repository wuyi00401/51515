const cases={
  feilaoshi:{kicker:'CASE 01 · EDUCATION IP',title:'费老师教育思维',body:'<p><b>项目目标：</b>围绕教育议题建立稳定、清晰的内容表达。</p><p><b>我的方法：</b>从受众焦虑与评论问题中提炼选题；用“直接钩子—观点拆解—纠偏建议—评论引导”组织口播；结合公开与第三方数据做阶段复盘。</p><p><b>数据边界：</b>账号规模与GMV属于账号经营结果，不直接归因于个人；作品集只呈现可说明的工作方法和参与内容。</p>'},
  dayu:{kicker:'CASE 02 · SHORT VIDEO',title:'大鱼教育思考',body:'<p><b>内容方向：</b>升学规划、教育认知与家庭决策。</p><p><b>我的方法：</b>通过对标研究寻找差异化表达，将复杂教育信息压缩成短句、编号和明确行动建议，让内容更适合口播与传播。</p><p><b>工作覆盖：</b>选题、脚本、拍摄沟通与复盘；历史数据存在第三方平台覆盖限制，因此不把估算写成后台事实。</p>'},
  film:{kicker:'CASE 03 · AI FILM',title:'《一夜归人》',body:'<p><b>创作任务：</b>把短剧剧本转换为可执行的AI影像方案。</p><p><b>我的方法：</b>为每个镜头定义景别、机位、人物动作、光线和情绪，先锁定首帧，再写视频运动；统一人物外观、空间方向与负面约束，减少生成漂移。</p><p><b>交付：</b>37镜头分镜提示词、关键首帧提示词与前63秒视频生成方案。</p>'}
};
const modal=document.querySelector('#case-modal');
document.querySelectorAll('[data-modal]').forEach(btn=>btn.addEventListener('click',()=>{const c=cases[btn.dataset.modal];modal.querySelector('.modal-kicker').textContent=c.kicker;modal.querySelector('.modal-title').textContent=c.title;modal.querySelector('.modal-body').innerHTML=c.body;modal.showModal()}));
modal.querySelector('.close').addEventListener('click',()=>modal.close());modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.querySelector('.copy-btn').addEventListener('click',async e=>{await navigator.clipboard.writeText(e.currentTarget.dataset.copy);const old=e.currentTarget.textContent;e.currentTarget.textContent='已复制，请替换为真实联系方式';setTimeout(()=>e.currentTarget.textContent=old,1800)});
