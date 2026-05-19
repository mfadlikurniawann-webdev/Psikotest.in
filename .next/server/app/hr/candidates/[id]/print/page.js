(()=>{var e={};e.id=228,e.ids=[228],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4770:e=>{"use strict";e.exports=require("crypto")},2048:e=>{"use strict";e.exports=require("fs")},8216:e=>{"use strict";e.exports=require("net")},9801:e=>{"use strict";e.exports=require("os")},6119:e=>{"use strict";e.exports=require("perf_hooks")},6162:e=>{"use strict";e.exports=require("stream")},2452:e=>{"use strict";e.exports=require("tls")},2254:e=>{"use strict";e.exports=require("node:buffer")},6005:e=>{"use strict";e.exports=require("node:crypto")},7261:e=>{"use strict";e.exports=require("node:util")},1122:(e,a,t)=>{"use strict";t.r(a),t.d(a,{GlobalError:()=>s.a,__next_app__:()=>u,originalPathname:()=>m,pages:()=>c,routeModule:()=>h,tree:()=>o}),t(2348),t(8295),t(5866);var n=t(3191),i=t(8716),r=t(7922),s=t.n(r),l=t(5231),d={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>l[e]);t.d(a,d);let o=["",{children:["hr",{children:["candidates",{children:["[id]",{children:["print",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,2348)),"D:\\Project_NgodingLagi\\psikotest.in\\src\\app\\hr\\candidates\\[id]\\print\\page.js"]}]},{}]},{}]},{}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,8295)),"D:\\Project_NgodingLagi\\psikotest.in\\src\\app\\layout.js"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,5866,23)),"next/dist/client/components/not-found-error"]}],c=["D:\\Project_NgodingLagi\\psikotest.in\\src\\app\\hr\\candidates\\[id]\\print\\page.js"],m="/hr/candidates/[id]/print/page",u={require:t,loadChunk:()=>Promise.resolve()},h=new n.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/hr/candidates/[id]/print/page",pathname:"/hr/candidates/[id]/print",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:o}})},2329:(e,a,t)=>{Promise.resolve().then(t.t.bind(t,2994,23)),Promise.resolve().then(t.t.bind(t,6114,23)),Promise.resolve().then(t.t.bind(t,9727,23)),Promise.resolve().then(t.t.bind(t,9671,23)),Promise.resolve().then(t.t.bind(t,1868,23)),Promise.resolve().then(t.t.bind(t,4759,23))},8291:()=>{},7766:(e,a,t)=>{Promise.resolve().then(t.bind(t,811))},811:(e,a,t)=>{"use strict";function n(){return null}t.d(a,{default:()=>n}),t(7577)},8585:(e,a,t)=>{"use strict";var n=t(1085);t.o(n,"notFound")&&t.d(a,{notFound:function(){return n.notFound}}),t.o(n,"redirect")&&t.d(a,{redirect:function(){return n.redirect}})},1085:(e,a,t)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),function(e,a){for(var t in a)Object.defineProperty(e,t,{enumerable:!0,get:a[t]})}(a,{ReadonlyURLSearchParams:function(){return s},RedirectType:function(){return n.RedirectType},notFound:function(){return i.notFound},permanentRedirect:function(){return n.permanentRedirect},redirect:function(){return n.redirect}});let n=t(3953),i=t(6399);class r extends Error{constructor(){super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams")}}class s extends URLSearchParams{append(){throw new r}delete(){throw new r}set(){throw new r}sort(){throw new r}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),e.exports=a.default)},6399:(e,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),function(e,a){for(var t in a)Object.defineProperty(e,t,{enumerable:!0,get:a[t]})}(a,{isNotFoundError:function(){return i},notFound:function(){return n}});let t="NEXT_NOT_FOUND";function n(){let e=Error(t);throw e.digest=t,e}function i(e){return"object"==typeof e&&null!==e&&"digest"in e&&e.digest===t}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),e.exports=a.default)},8586:(e,a)=>{"use strict";var t;Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"RedirectStatusCode",{enumerable:!0,get:function(){return t}}),function(e){e[e.SeeOther=303]="SeeOther",e[e.TemporaryRedirect=307]="TemporaryRedirect",e[e.PermanentRedirect=308]="PermanentRedirect"}(t||(t={})),("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),e.exports=a.default)},3953:(e,a,t)=>{"use strict";var n;Object.defineProperty(a,"__esModule",{value:!0}),function(e,a){for(var t in a)Object.defineProperty(e,t,{enumerable:!0,get:a[t]})}(a,{RedirectType:function(){return n},getRedirectError:function(){return d},getRedirectStatusCodeFromError:function(){return g},getRedirectTypeFromError:function(){return h},getURLFromRedirectError:function(){return u},isRedirectError:function(){return m},permanentRedirect:function(){return c},redirect:function(){return o}});let i=t(4580),r=t(2934),s=t(8586),l="NEXT_REDIRECT";function d(e,a,t){void 0===t&&(t=s.RedirectStatusCode.TemporaryRedirect);let n=Error(l);n.digest=l+";"+a+";"+e+";"+t+";";let r=i.requestAsyncStorage.getStore();return r&&(n.mutableCookies=r.mutableCookies),n}function o(e,a){void 0===a&&(a="replace");let t=r.actionAsyncStorage.getStore();throw d(e,a,(null==t?void 0:t.isAction)?s.RedirectStatusCode.SeeOther:s.RedirectStatusCode.TemporaryRedirect)}function c(e,a){void 0===a&&(a="replace");let t=r.actionAsyncStorage.getStore();throw d(e,a,(null==t?void 0:t.isAction)?s.RedirectStatusCode.SeeOther:s.RedirectStatusCode.PermanentRedirect)}function m(e){if("object"!=typeof e||null===e||!("digest"in e)||"string"!=typeof e.digest)return!1;let[a,t,n,i]=e.digest.split(";",4),r=Number(i);return a===l&&("replace"===t||"push"===t)&&"string"==typeof n&&!isNaN(r)&&r in s.RedirectStatusCode}function u(e){return m(e)?e.digest.split(";",3)[2]:null}function h(e){if(!m(e))throw Error("Not a redirect error");return e.digest.split(";",2)[1]}function g(e){if(!m(e))throw Error("Not a redirect error");return Number(e.digest.split(";",4)[3])}(function(e){e.push="push",e.replace="replace"})(n||(n={})),("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),e.exports=a.default)},2348:(e,a,t)=>{"use strict";t.r(a),t.d(a,{default:()=>o});var n=t(9510),i=t(6385),r=t(5837),s=t(8585);let l=(0,t(8570).createProxy)(String.raw`D:\Project_NgodingLagi\psikotest.in\src\app\hr\candidates\[id]\print\AutoPrint.js#default`);function d(e){if(!e)return"";let a=new Date(e),t=a.getDate(),n=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"][a.getMonth()],i=a.getFullYear();return`${t} ${n} ${i}`}async function o({params:e}){let{id:a}=e;if("hr"!==(await (0,r.ts)()).role)return n.jsx("div",{className:"p-8 text-red-600 font-bold",children:"Akses Ditolak: Hanya HR yang dapat mengakses halaman ini."});let t=await (0,i.Z)`
    SELECT * FROM users WHERE id = ${a} AND role = 'candidate' LIMIT 1
  `;0===t.length&&(0,s.notFound)();let o=t[0],c=await (0,i.Z)`
    SELECT * FROM test_sessions 
    WHERE user_id = ${o.id} AND test_type = 'psikotes' AND status = 'completed'
    ORDER BY id DESC LIMIT 1
  `;if(0===c.length)return n.jsx("div",{className:"p-8 text-amber-600 font-bold",children:"Kandidat belum menyelesaikan ujian psikotes atau status belum selesai."});let m=c[0],u=m.result_detail||{},h=o.name,g=h.length%3,p=u.verbal?.score??60,x=u.numerik?.score??50,b=u.logika?.score??50,k=u.kepribadian?.kolaborasi??60,j=u.kepribadian?.ketelitian??60,f=u.kepribadian?.stabilitas??60,y=u.kepribadian?.kepemimpinan??60,v=u.kepribadian?.integritas??60,N="female"===o.gender?"Perempuan":"male"===o.gender?"Laki-laki":"Perempuan",M=o.birth_date?`${new Date().getFullYear()-new Date(o.birth_date).getFullYear()} Tahun`:"23 Tahun",w=o.education||"D4 / Sarjana Terapan",P=m.score,S="";S=P>=120?`Sdr/Sdri ${h} memiliki taraf intelegensi superior dengan skor ${P} sehingga ia mampu untuk memahami instruksi yang kompleks, melakukan analisis data secara mendalam, serta memecahkan masalah-masalah berskala besar secara taktis dan terstruktur dengan sangat cepat. Ia memiliki kemampuan verbal yang prima dan pemahaman logikal di atas rata-rata kelompok usianya.`:P>=90?`Sdr/Sdri ${h} memiliki taraf intelegensi rata-rata yang stabil dengan skor ${P} sehingga ia mampu untuk memahami instruksi secara sederhana maupun menengah dengan baik. Ia membutuhkan waktu yang wajar untuk memahami detail instruksi yang terlalu rumit, namun memiliki dasar penalaran verbal dan numerikal yang mantap serta memadai dalam menyelesaikan beban kerja rutin harian.`:`Sdr/Sdri ${h} lebih siap dalam memahami instruksi kerja operasional yang sifatnya praktis dan terstruktur dengan skor ${P}. Ia memerlukan bimbingan bertahap untuk tugas yang memerlukan tingkat penalaran akademis yang tinggi, namun memiliki ketekunan operasional yang baik jika diberikan arahan kerja yang jelas.`;let _=`Sdr/Sdri ${h} memiliki kecepatan kerja yang cukup baik dan berimbang dengan ketelitiannya. Ia cenderung teliti dan berhati-hati dalam mengelola kerapian tugas harian guna meminimalisir kesalahan operasional. Daya tahan kerjanya dalam menghadapi ritme kerja cepat cukup stabil, didukung oleh keuletan kerja yang membuatnya tidak mudah menyerah saat menghadapi kendala teknis di lapangan.`,R=e=>[1,2,3,4,5].map(a=>n.jsx("td",{className:`scale-val ${e===a?"active":""}`,children:e===a?"X":""},a));return(0,n.jsxs)(n.Fragment,{children:[n.jsx("style",{dangerouslySetInnerHTML:{__html:`
        @page {
          margin: 1.5cm;
          size: A4;
        }
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 11px;
          color: #1e293b;
          line-height: 1.4;
          background: #ffffff;
          margin: 0;
          padding: 0;
        }
        .page {
          page-break-after: always;
          position: relative;
          height: auto;
          box-sizing: border-box;
        }
        .page-no-break {
          position: relative;
          height: auto;
          box-sizing: border-box;
        }
        
        .header-logo {
          text-align: center;
          margin-bottom: 15px;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 8px;
        }
        .header-logo .brand {
          font-size: 16px;
          font-weight: bold;
          color: #0f172a;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .header-logo .sub-brand {
          font-size: 10px;
          font-weight: bold;
          color: #475569;
          margin-top: 2px;
        }
        .header-logo .contact {
          font-size: 8px;
          color: #64748b;
          margin-top: 2px;
        }

        .cover-container {
          text-align: center;
          padding-top: 3cm;
        }
        .cover-logo {
          font-size: 28px;
          font-weight: 800;
          color: #be185d;
          letter-spacing: 4px;
          margin-bottom: 2cm;
        }
        .cover-logo-desc {
          font-size: 12px;
          color: #475569;
          margin-top: -1.8cm;
          margin-bottom: 2cm;
          text-transform: uppercase;
        }
        .cover-photo-box {
          background-color: #f1f5f9;
          border: 1px dashed #94a3b8;
          height: 5cm;
          margin: 1cm auto;
          width: 80%;
          border-radius: 8px;
          display: block;
        }
        .cover-photo-box-content {
          padding-top: 2cm;
          color: #64748b;
          font-size: 12px;
          font-style: italic;
        }
        .cover-title {
          font-size: 20px;
          font-weight: bold;
          color: #0f172a;
          margin-top: 1.5cm;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .cover-subtitle {
          font-size: 11px;
          color: #64748b;
          font-style: italic;
          margin-top: 5px;
          margin-bottom: 1.5cm;
        }
        .cover-bottom {
          margin-top: 3cm;
          font-size: 12px;
          font-weight: bold;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .cover-bottom-sub {
          font-size: 9px;
          color: #64748b;
          margin-top: 4px;
        }

        .section-title {
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          color: #0f172a;
          margin-top: 15px;
          margin-bottom: 8px;
        }
        .identitas-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        .identitas-table td {
          border: 1px solid #94a3b8;
          padding: 6px 10px;
          vertical-align: middle;
        }
        .identitas-table td.label-num {
          width: 4%;
          text-align: center;
          font-weight: bold;
        }
        .identitas-table td.label-text {
          width: 18%;
          font-weight: bold;
        }
        .identitas-table td.val-text {
          width: 28%;
        }

        .hasil-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        .hasil-table th {
          background-color: #fed7aa;
          border: 1px solid #475569;
          padding: 6px;
          font-weight: bold;
          text-align: center;
          font-size: 10px;
          text-transform: uppercase;
        }
        .hasil-table td {
          border: 1px solid #475569;
          padding: 5px 8px;
          vertical-align: middle;
        }
        .hasil-table td.aspect-header {
          font-weight: bold;
          background-color: #f8fafc;
          text-transform: uppercase;
          font-size: 9px;
        }
        .hasil-table td.scale-val {
          width: 4%;
          text-align: center;
          font-weight: bold;
          font-size: 12px;
        }
        .hasil-table td.scale-val.active {
          background-color: #cbd5e1 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color: #000000;
        }
        
        .type-box {
          border: 1px solid #475569;
          padding: 8px 12px;
          font-weight: bold;
          background-color: #f8fafc;
          margin-top: 10px;
          margin-bottom: 15px;
          font-size: 10px;
        }

        .iq-bar-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          margin-bottom: 15px;
        }
        .iq-bar-table td {
          border: 1px solid #475569;
          padding: 8px;
          text-align: center;
          font-size: 9px;
          font-weight: bold;
        }
        .iq-bar-table td.iq-label {
          background-color: #fed7aa;
          width: 25%;
          font-size: 11px;
          text-align: left;
          padding-left: 12px;
        }
        .iq-bar-table td.active {
          background-color: #94a3b8 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color: #ffffff;
        }

        .profile-p {
          text-align: justify;
          text-indent: 1cm;
          margin-bottom: 12px;
          line-height: 1.5;
          font-size: 10px;
        }
        
        .styled-list {
          margin-top: 5px;
          margin-bottom: 15px;
          padding-left: 20px;
        }
        .styled-list li {
          margin-bottom: 6px;
          line-height: 1.4;
          text-align: justify;
          font-size: 10px;
        }

        .sig-container {
          margin-top: 2cm;
          width: 100%;
        }
        .sig-table {
          width: 100%;
          border-collapse: collapse;
        }
        .sig-table td {
          vertical-align: top;
        }
        .sig-table td.left-space {
          width: 60%;
        }
        .sig-table td.sig-content {
          width: 40%;
          text-align: center;
        }
        .sig-date {
          margin-bottom: 1.5cm;
          font-size: 10px;
        }
        .sig-name {
          font-weight: bold;
          text-decoration: underline;
          font-size: 11px;
        }
        .sig-license {
          font-size: 9px;
          color: #475569;
          margin-top: 2px;
        }
        .sig-placeholder {
          height: 1.2cm;
        }
      `}}),n.jsx(l,{}),n.jsx("div",{className:"page",children:(0,n.jsxs)("div",{className:"cover-container",children:[n.jsx("div",{className:"cover-logo",children:"ALPHA CONSULTING"}),n.jsx("div",{className:"cover-logo-desc",children:"Psychological Service & Business Consulting"}),n.jsx("div",{className:"cover-photo-box",children:n.jsx("div",{className:"cover-photo-box-content",children:"Talent Assessment & Development Program"})}),n.jsx("div",{className:"cover-title",children:"Assessment & Management Talenta"}),n.jsx("div",{className:"cover-subtitle",children:"Right Person in Right Position"}),n.jsx("div",{className:"cover-bottom",children:"Outsourcing & Recruitment"}),n.jsx("div",{className:"cover-bottom-sub",children:"Provide Talent by Needs"})]})}),(0,n.jsxs)("div",{className:"page",children:[(0,n.jsxs)("div",{className:"header-logo",children:[n.jsx("div",{className:"brand",children:"Alpha Consulting"}),n.jsx("div",{className:"sub-brand",children:"Psychological Service & Business Consulting"}),n.jsx("div",{className:"contact",children:"E-mail: alphaconsulting.id@gmail.com | HP: 082269899003"})]}),(0,n.jsxs)("div",{style:{marginTop:"30px"},children:[n.jsx("p",{style:{fontWeight:"bold",fontSize:"13px",marginBottom:"5px"},children:"Potential Review :"}),n.jsx("p",{style:{fontWeight:"bold",fontSize:"11px",marginBottom:"10px"},children:"Potential Review adalah"}),n.jsx("p",{style:{textAlign:"justify",lineHeight:"1.5",fontSize:"10px",marginBottom:"20px"},children:"Potential review adalah Kemampuanmu dalam melakukan potential review ini sangat menunjang kariermu. Sebagian orang belum menyadari ini, terkadang mereka lebih sibuk mengembangkan diri menjadi calon pekerja yang qualified sesuai kebutuhan lapangan kerja, ketimbang menemukan passion melalui kepribadiannya sendiri."}),n.jsx("p",{style:{fontWeight:"bold",fontSize:"11px",marginBottom:"10px"},children:"Tujuan potensial review :"}),(0,n.jsxs)("ol",{style:{paddingLeft:"20px",lineHeight:"1.6",fontSize:"10px"},children:[(0,n.jsxs)("li",{style:{marginBottom:"12px",textAlign:"justify"},children:[n.jsx("strong",{children:"Mengetahui alasan dalam bertindak"}),n.jsx("br",{}),"Dengan menilai diri sendiri, kamu bisa mengetahui apa yang harus kamu lakukan ketika menghadapi masalah. Setelah kamu menyadari bagaimana kamu mengatasi persoalan, kamu bisa memahami apa yang membuatmu benar-benar berpikir."]}),(0,n.jsxs)("li",{style:{marginBottom:"12px",textAlign:"justify"},children:[n.jsx("strong",{children:"Bisa Meningkatkan Kualitas kinerja"}),n.jsx("br",{}),"Setelah mengetahui berbagai kekuranganmu, kamu mulai terdorong untuk memperbaiki diri. Di sini kamu juga punya kesempatan untuk mencari tahu, bagaimana agar bisa bekerja dengan komitmen, jujur, dan penuh tanggung jawab."]}),(0,n.jsxs)("li",{style:{marginBottom:"12px",textAlign:"justify"},children:[n.jsx("strong",{children:"Mengetahui progress pekerjaan"}),n.jsx("br",{}),"Sebelumnya kamu telah banyak belajar tentang motivasi diri dan bagaimana meningkatkan kualitas kinerja. Kini kamu bisa membandingkan kinerjamu yang sekarang dengan kinerjamu sebelumnya. Lebih baik, stabil, atau justru menurun?"]}),(0,n.jsxs)("li",{style:{marginBottom:"12px",textAlign:"justify"},children:[n.jsx("strong",{children:"Memiliki pola pikir yang strategis dan sistematis"}),n.jsx("br",{}),"Kamu sudah mampu melakukan penilaian terhadap cara berpikir, tindakan, dan pekerjaanmu. Dengan begitu kamu jadi punya pola pikir yang lebih strategis, artinya tepat sasaran dalam menentukan dan mencapai tujuan. Lalu berpikir sistematis, segala yang kamu pikirkan dan lakukan dapat disusun dengan baik dan terencana."]}),(0,n.jsxs)("li",{style:{marginBottom:"12px",textAlign:"justify"},children:[n.jsx("strong",{children:"Mengevaluasi efektivitas tindakanmu"}),n.jsx("br",{}),"Poin yang nggak kalah penting adalah kamu bisa mengevaluasi diri dari setiap proyek yang kamu kerjakan. Kelebihan, kekurangan, motivasi diri, hingga cara berpikir. Pada tahap akhir, kamu bisa mengetahui implikasi yang ditimbulkan atas tindakanmu sebagai kesimpulan."]})]})]})]}),(0,n.jsxs)("div",{className:"page",children:[(0,n.jsxs)("div",{className:"header-logo",children:[n.jsx("div",{className:"brand",children:"Alpha Consulting"}),n.jsx("div",{className:"sub-brand",children:"Psychological Service & Business Consulting"}),n.jsx("div",{className:"contact",children:"E-mail: alphaconsulting.id@gmail.com | HP: 082269899003"})]}),n.jsx("div",{className:"section-title",children:"I. Identitas"}),n.jsx("table",{className:"identitas-table",children:(0,n.jsxs)("tbody",{children:[(0,n.jsxs)("tr",{children:[n.jsx("td",{className:"label-num",children:"1."}),n.jsx("td",{className:"label-text",children:"Nama"}),n.jsx("td",{className:"val-text",children:o.name}),n.jsx("td",{className:"label-text",children:"Pendidikan"}),n.jsx("td",{className:"val-text",children:w})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{className:"label-num",children:"2."}),n.jsx("td",{className:"label-text",children:"Jenis Kelamin"}),n.jsx("td",{className:"val-text",children:N}),n.jsx("td",{className:"label-text",children:"Fakultas / Prodi"}),n.jsx("td",{className:"val-text",children:o.position_applied||"-"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{className:"label-num",children:"3."}),n.jsx("td",{className:"label-text",children:"Umur"}),n.jsx("td",{className:"val-text",children:M}),n.jsx("td",{className:"label-text",children:"Tanggal Tes"}),n.jsx("td",{className:"val-text",children:d(m.completed_at)})]})]})}),n.jsx("div",{className:"section-title",style:{marginTop:"10px"},children:"II. Hasil Psikotes"}),(0,n.jsxs)("table",{className:"hasil-table",children:[(0,n.jsxs)("thead",{children:[(0,n.jsxs)("tr",{children:[n.jsx("th",{rowSpan:2,style:{width:"25%"},children:"Aspek Psikologi"}),n.jsx("th",{rowSpan:2,style:{width:"32%"},children:"Gambaran Individu Bila Nilai Rendah"}),n.jsx("th",{colSpan:5,style:{width:"20%"},children:"Skala Baku"}),n.jsx("th",{rowSpan:2,style:{width:"23%"},children:"Gambaran Individu Bila Tinggi"})]}),(0,n.jsxs)("tr",{children:[n.jsx("th",{style:{width:"4%"},children:"1"}),n.jsx("th",{style:{width:"4%"},children:"2"}),n.jsx("th",{style:{width:"4%"},children:"3"}),n.jsx("th",{style:{width:"4%"},children:"4"}),n.jsx("th",{style:{width:"4%"},children:"5"})]})]}),(0,n.jsxs)("tbody",{children:[n.jsx("tr",{children:n.jsx("td",{className:"aspect-header",colSpan:8,children:"INTELESENSI / KOGNITIF"})}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Pemahaman"}),n.jsx("td",{children:"Lambat dalam menangkap inti masalah, pemahaman lambat"}),R(Math.max(1,Math.min(5,Math.round(p/100*3)+2-g%2))),n.jsx("td",{children:"Cepat mengerti inti masalah, cepat tanggap."})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Analisis dan Sintesis Bahasa"}),n.jsx("td",{children:"Lambat dalam memahami dan memaknai bahasa dengan baik"}),R(Math.max(1,Math.min(5,Math.round(p/100*3)+2+g%2))),n.jsx("td",{children:"Cepat dalam memahami dan memaknai bahasa"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Berpikir Fleksibel"}),n.jsx("td",{children:"Lambat dalam menganalisis hubungan antar kejadian dan mengkombinasikannya"}),R(Math.max(1,Math.min(5,Math.round(p/100*3)+1+g%2))),n.jsx("td",{children:"Cepat dalam menganalisis hubungan antar kejadian dan mengkombinasikannya"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Kemampuan Verbal"}),n.jsx("td",{children:"Lambat dalam mencerna konsep kata untuk mengambil kesimpulan secara umum"}),R(Math.max(1,Math.min(5,Math.round(p/100*3)+2))),n.jsx("td",{children:"Cepat dalam mencerna konsep kata dan mengambil kesimpulan secara umum"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Berfikir Praktis"}),n.jsx("td",{children:"Lambat dalam memahami realita dan mengambil keputusan berdasarkan fakta"}),R(Math.max(1,Math.min(5,Math.round(x/100*3)+2-g%2))),n.jsx("td",{children:"Cepat dalam memahami realita dan mengambil keputusan berdasarkan fakta"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Kemampuan Numerikal"}),n.jsx("td",{children:"Lambat dalam mencerna angka dan hitungan dalam persoalan hitungan"}),R(Math.max(1,Math.min(5,Math.round(x/100*3)+1+g%2))),n.jsx("td",{children:"Cepat dalam mencerna angka dan hitungan dalam persoalan hitungan"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Berfikir Strategis"}),n.jsx("td",{children:"Lambat dalam membayangkan secara holistic, berfikir konkret menyeluruh"}),R(Math.max(1,Math.min(5,Math.round(b/100*3)+2))),n.jsx("td",{children:"Cepat dalam membayangkan secara holistic, berfikir konkret menyeluruh"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Memori"}),n.jsx("td",{children:"Lambat untuk mengingat informasi yang diterima secara akurat dengan konsentrasi kurang"}),R(Math.max(1,Math.min(5,Math.round(b/100*3)+2-g%2))),n.jsx("td",{children:"Cepat untuk mengingat informasi yang diterima secara akurat dengan konsentrasi menetap"})]}),n.jsx("tr",{children:n.jsx("td",{className:"aspect-header",colSpan:8,children:"POLA KERJA"})}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Kecepatan Kerja"}),n.jsx("td",{children:"Lambat bekerja, lambat menyesuaikan diri dengan pekerjaan."}),R(Math.max(1,Math.min(5,Math.round(k/100*3)+2))),n.jsx("td",{children:"Cepat, dan mudah menyesuaikan dengan pekerjaan"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Ketelitian Kerja"}),n.jsx("td",{children:"Banyak kesalahan, tidak konsentrasi dalam bekerja"}),R(Math.max(1,Math.min(5,Math.round(j/100*3)+2))),n.jsx("td",{children:"Penuh konsentrasi, sedikit membuat kesalahan."})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Daya Tahan Kerja"}),n.jsx("td",{children:"Tidak tahan pada tugas dan cenderung cepat bosan"}),R(Math.max(1,Math.min(5,Math.round(f/100*3)+2))),n.jsx("td",{children:"Sabar dan tahan terhadap tugas rutin, tidak mudah bosan"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Keuletan Kerja"}),n.jsx("td",{children:"Mudah menyerah pada kesulitan dan hambatan, kurang ulet."}),R(Math.max(1,Math.min(5,Math.round(y/100*3)+1))),n.jsx("td",{children:"Ulet, telaten dan selalu penuh semangat, penuh harapan"})]}),n.jsx("tr",{children:n.jsx("td",{className:"aspect-header",colSpan:8,children:"KEPRIBADIAN"})}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Stabilitas Emosi"}),n.jsx("td",{children:"Pengendalian diri lemah, mudah terpengaruh"}),R(Math.max(1,Math.min(5,Math.round(f/100*3)+2))),n.jsx("td",{children:"Pengendalian diri prima, akurat dan mantab."})]})]})]})]}),(0,n.jsxs)("div",{className:"page",children:[(0,n.jsxs)("div",{className:"header-logo",children:[n.jsx("div",{className:"brand",children:"Alpha Consulting"}),n.jsx("div",{className:"sub-brand",children:"Psychological Service & Business Consulting"}),n.jsx("div",{className:"contact",children:"E-mail: alphaconsulting.id@gmail.com | HP: 082269899003"})]}),(0,n.jsxs)("table",{className:"hasil-table",children:[(0,n.jsxs)("thead",{children:[(0,n.jsxs)("tr",{children:[n.jsx("th",{rowSpan:2,style:{width:"25%"},children:"Aspek Kepribadian"}),n.jsx("th",{rowSpan:2,style:{width:"32%"},children:"Gambaran Individu Bila Nilai Rendah"}),n.jsx("th",{colSpan:5,style:{width:"20%"},children:"Skala Baku"}),n.jsx("th",{rowSpan:2,style:{width:"23%"},children:"Gambaran Individu Bila Tinggi"})]}),(0,n.jsxs)("tr",{children:[n.jsx("th",{style:{width:"4%"},children:"1"}),n.jsx("th",{style:{width:"4%"},children:"2"}),n.jsx("th",{style:{width:"4%"},children:"3"}),n.jsx("th",{style:{width:"4%"},children:"4"}),n.jsx("th",{style:{width:"4%"},children:"5"})]})]}),(0,n.jsxs)("tbody",{children:[(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Percaya Diri/Mandiri"}),n.jsx("td",{children:"Tidak yakin akan kemampuan diri & mudah terpengaruh orang lain"}),R(Math.max(1,Math.min(5,Math.round(y/100*3)+2))),n.jsx("td",{children:"Penuh keyakinan akan kemampuan diri, penuh kepastian"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Tanggung jawab"}),n.jsx("td",{children:"Tidak berani menghadapi resiko, menghindar dari tugas atau beban"}),R(Math.max(1,Math.min(5,Math.round(j/100*3)+2))),n.jsx("td",{children:"Berani menghadapi segala resiko atas tugas/beban kerja."})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Kemauan Melayani"}),n.jsx("td",{children:"Kurang simpati dalam memberi pelayanan"}),R(Math.max(1,Math.min(5,Math.round(k/100*3)+2))),n.jsx("td",{children:"Penuh simpati dalam memberi pelayanan"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Kepatuhan dan ketaatan"}),n.jsx("td",{children:"Cenderung tidak puas terhadap atasan, cenderung mengabaikan peraturan"}),R(Math.max(1,Math.min(5,Math.round(v/100*3)+2))),n.jsx("td",{children:"Loyal, patuh kepada kebijaksanaan/ perintah, peraturan dan struktur organisasi"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Hasrat berprestasi"}),n.jsx("td",{children:"Bekerja asal jadi, tidak berusaha untuk mencapai hasil yang terbaik."}),R(Math.max(1,Math.min(5,Math.round(v/100*3)+2))),n.jsx("td",{children:"Penuh kesungguhan, berusaha mencapai hasil terbaik."})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Penyesuaian Diri"}),n.jsx("td",{children:"Membatasi diri, tak mau terlihat, kaku"}),R(Math.max(1,Math.min(5,Math.round(k/100*3)+2))),n.jsx("td",{children:"Supel, mudah bekerjasama dan luwes dalam pergaulan"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Minat bekerja dengan hal detail"}),n.jsx("td",{children:"Kurang menyukai pekerjaan dengan hal-hal yang detail"}),R(Math.max(1,Math.min(5,Math.round(j/100*3)+2))),n.jsx("td",{children:"Sangat menyukai kegiatan atau pekerjaan yang detail"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Inisiatif"}),n.jsx("td",{children:"Lambat memiliki gagasan baru, terlalu lama merenung, cenderung menghindar keputusan"}),R(Math.max(1,Math.min(5,Math.round(y/100*3)+2))),n.jsx("td",{children:"Aktif, sangat yakin keputusan diambil, memiliki ide baru, cepat tanggap terhadap situasi"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Kepemimpinan"}),n.jsx("td",{children:"Belum memiliki potensi untuk melakukan fungsi pengarahan"}),R(Math.max(1,Math.min(5,Math.round(y/100*3)+1))),n.jsx("td",{children:"Memiliki potensi dan bertanggung jawab dalam melakukan fungsi pengarahan"})]}),(0,n.jsxs)("tr",{children:[n.jsx("td",{style:{fontWeight:"bold"},children:"Hubungan Sosial"}),n.jsx("td",{children:"Lambat dalam menjalin hubungan sosial dengan orang lain"}),R(Math.max(1,Math.min(5,Math.round(k/100*3)+2))),n.jsx("td",{children:"Memiliki hubungan dengan empati tinggi sehingga mudah menjalin hubungan sosial."})]})]})]}),(0,n.jsxs)("div",{className:"type-box",children:["Tipe Kepribadian : ","Advocate atau Kolaborator Mandiri yang berusaha membangun hubungan yang positif di tempat kerja."]}),n.jsx("table",{className:"iq-bar-table",children:n.jsx("tbody",{children:(0,n.jsxs)("tr",{children:[(0,n.jsxs)("td",{className:"iq-label",children:["Intelegensi : ",m.score]}),n.jsx("td",{className:m.score<80?"active":"",children:"Sangat Rendah"}),n.jsx("td",{className:m.score>=80&&m.score<90?"active":"",children:"Rata-rata bawah"}),n.jsx("td",{className:m.score>=90&&m.score<110?"active":"",children:"Rata-Rata"}),n.jsx("td",{className:m.score>=110&&m.score<120?"active":"",children:"Rata-Rata Atas"}),n.jsx("td",{className:m.score>=120&&m.score<130?"active":"",children:"Tinggi"}),n.jsx("td",{className:m.score>=130?"active":"",children:"Sangat Tinggi"})]})})}),n.jsx("div",{className:"section-title",children:"III. Personal Profile"}),n.jsx("p",{className:"profile-p",children:S})]}),(0,n.jsxs)("div",{className:"page-no-break",children:[(0,n.jsxs)("div",{className:"header-logo",children:[n.jsx("div",{className:"brand",children:"Alpha Consulting"}),n.jsx("div",{className:"sub-brand",children:"Psychological Service & Business Consulting"}),n.jsx("div",{className:"contact",children:"E-mail: alphaconsulting.id@gmail.com | HP: 082269899003"})]}),(0,n.jsxs)("div",{style:{marginTop:"15px"},children:[n.jsx("p",{className:"profile-p",style:{marginTop:0},children:_}),n.jsx("p",{className:"profile-p",children:"Dalam aspek kepribadian, ia merupakan pribadi yang memiliki stabilitas emosi yang stabil dan mampu mengendalikan perasaannya dalam situasi tertekan. Memiliki tingkat kepercayaan diri yang wajar dalam bergaul dan menunjukkan kemauan melayani yang hangat. Kepatuhannya terhadap peraturan organisasi sangat baik, dibarengi dengan tanggung jawab yang tinggi terhadap pemenuhan kewajiban kerjanya. Secara sosial, ia kooperatif dan mudah menyesuaikan diri dengan tim baru."}),n.jsx("div",{className:"section-title",style:{marginTop:"25px"},children:"Kekuatan"}),n.jsx("ol",{className:"styled-list",type:"a",children:["Memiliki kemampuan analisis logikal dan verbal yang memadai dalam menangkap inti instruksi kerja.","Tanggung jawab tinggi dalam menuntaskan penugasan kerja operasional dengan teliti.","Stabilitas emosi stabil sehingga mampu beradaptasi di bawah tekanan ritme kerja perusahaan."].map((e,a)=>n.jsx("li",{children:e},a))}),n.jsx("div",{className:"section-title",style:{marginTop:"20px"},children:"Saran Pengembangan"}),n.jsx("ol",{className:"styled-list",type:"a",children:["Perlu meningkatkan inisiatif mandiri untuk tidak selalu menunggu instruksi formal dari atasan.","Meningkatkan rasa percaya diri untuk berani menyampaikan gagasan orisinal dalam forum tim.","Perlu mengoptimalkan kemampuan numerikal dan penyusunan strategi pemecahan masalah teknis."].map((e,a)=>n.jsx("li",{children:e},a))})]}),n.jsx("div",{className:"sig-container",children:n.jsx("table",{className:"sig-table",children:n.jsx("tbody",{children:(0,n.jsxs)("tr",{children:[n.jsx("td",{className:"left-space"}),(0,n.jsxs)("td",{className:"sig-content",children:[(0,n.jsxs)("div",{className:"sig-date",children:["Bandar lampung, ",d(m.completed_at)]}),n.jsx("div",{className:"sig-placeholder",children:n.jsx("div",{style:{width:"100px",height:"35px",borderBottom:"1px solid #475569",margin:"0 auto",marginBottom:"5px"}})}),n.jsx("div",{className:"sig-name",children:"Ine Laynazka, M. Psi., Psikolog"}),n.jsx("div",{className:"sig-license",children:"SIPP. 4177-22-21"})]})]})})})})]})]})}},8295:(e,a,t)=>{"use strict";t.r(a),t.d(a,{default:()=>l,metadata:()=>s});var n=t(9510),i=t(5486),r=t.n(i);t(5023);let s={title:"Psikotest.in — Platform Asesmen Psikologi Rekrutmen",description:"Platform psikotest online dengan pengawasan realtime untuk rekrutmen karyawan profesional."};function l({children:e}){return n.jsx("html",{lang:"id",className:r().variable,children:n.jsx("body",{className:"antialiased min-h-screen bg-ink-50 font-sans",children:e})})}},5837:(e,a,t)=>{"use strict";t.d(a,{Oe:()=>o,WX:()=>m,c_:()=>d,fT:()=>c,ts:()=>u});var n=t(6091),i=t(6176),r=t(2023),s=t.n(r);let l=new TextEncoder().encode(process.env.JWT_SECRET||"psikotest-secret-key-32-characters-minimum-for-security");function d(e){return s().hashSync(e,10)}function o(e,a){try{let t=a;return a&&a.startsWith("$2y$")&&(t="$2a$"+a.substring(4)),s().compareSync(e,t)}catch(e){return console.error("Password comparison error:",e),!1}}async function c(e){return await new n.N(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("24h").sign(l)}async function m(e){if(!e)return null;try{let{payload:a}=await (0,i._)(e,l);return a}catch(e){return null}}async function u(){try{let{cookies:e}=await t.e(615).then(t.bind(t,1615)),a=e().get("auth_token")?.value;return await m(a)}catch(e){return null}}},6385:(e,a,t)=>{"use strict";t.d(a,{Z:()=>i});var n=t(8937);global.postgresSql||(global.postgresSql=(0,n.Z)((()=>{if(process.env.DATABASE_URL)return process.env.DATABASE_URL;let e=process.env.DB_HOST,a=process.env.DB_PORT||"5432",t=process.env.DB_DATABASE,n=process.env.DB_USERNAME,i=process.env.DB_PASSWORD;if(!e)throw Error("Database configuration (DB_HOST) missing in environment variables.");return`postgresql://${n}:${i}@${e}:${a}/${t}?sslmode=require`})(),{ssl:"require",transform:{undefined:null}}));let i=global.postgresSql},5023:()=>{}};var a=require("../../../../../webpack-runtime.js");a.C(e);var t=e=>a(a.s=e),n=a.X(0,[276,633,293],()=>t(1122));module.exports=n})();