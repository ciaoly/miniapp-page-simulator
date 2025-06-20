const apps = {
  
  "html-demo": {
    html: `
    <div class="app" data-link="html-demo/index.html" data-role="app" data-app-name="html-demo"
        style="padding: 0 0 8px 0; margin: 18px 0 60px 0; border-radius: 8px; background-color: #eee; position: relative;">
      <div class="app-content" style="justify-content: center;">
        <div class="app-description">
          <div class="app-menu" style="width: 100%;justify-content: center;">
            <style>
              .app[data-app-name="html-demo"] .app-menu-item:not(.active) { background: white; }
            </style>
            <div class="app-menu-item" data-role="link" data-link="html-demo">
              <img class="app-menu-app-icon" src="html-demo/static/app-logo.svg"
                  style="border-radius: 20px; margin-right: 2px;">
              <span class="app-menu-app-title">自定义html</span>
            </div>
            <div class="app-menu-item" data-role="link" data-link="html-demo/scan.html">
              <img class="app-menu-app-icon" src="common/icons/qr_code_scanner.svg">
              <span class="app-menu-app-title">子菜单</span>
            </div>
            <div class="app-menu-item ${localStorage.getItem("pinned") 
                  && localStorage.getItem("pinned").split(",").indexOf("html-demo") >= 0 
                  && "active" || ""}" data-role="pin">
              <img class="app-menu-app-icon" src="common/icons/push_pin.svg">
            </div>
            <div class="app-menu-item" data-role="help" style="margin-right: 0;">
              <img class="app-menu-app-icon" src="common/icons/info.svg">
            </div>
          </div>
        </div>
      </div>
      <div class="app-help" style="position: fixed; bottom: 0; left: 0; margin: 30px 12px;
          background-color: #fff; border: 2px solid #000; z-index: 20;"
          onclick="this.style.display = 'none'; 
              this.closest('.app').querySelector('.app-menu-item[data-role=help]').classList.remove('active');">
        <div class="app-help-subtitle">使用说明(弹窗效果)</div>
        <p>使用说明</p>
        <p>欢迎使用</p>
      </div>
    </div>`,
    title: "自定义html",
    icon: "html-demo/static/app-logo.svg",
    link: "html-demo/index.html",
    color: "#bf4046",
    help_text:
      "<p>帮助文本</p>",
    menu: [
      { title: "子菜单", icon: "@qr_code_scanner", link: "html-demo/scan.html" }
    ],
  },
  "demo": {
    title: "示例",
    icon: "demo/static/logo.png",
    link: "demo/index.html",
    color: "#68b82e",
    help_text:
      "<p>帮助</p>",
    menu: [
      {
        title: "子菜单",
        icon: "@place",
        link: "demo/index.html#checkin",
      }
    ],
    contributors: [
      {
        name: "贡献者",
        description: "参与制作",
        style: "namestrip",
      },
    ],
  }
};

function render() {
  let html = "";
  for (const [name, app] of Object.entries(apps)) {
    if (app.html) { html += app.html; continue; }
    let menu_html = "";
    if (app.menu) {
      for (const menu_item of app.menu) {
        let icon = menu_item.icon || "@qr_code";
        if (icon.startsWith("@")) {
          icon = `common/icons/${icon.slice(1)}.svg`;
        }
        menu_html += `
          <div class="app-menu-item" data-role="link" data-link="${menu_item.link || ""}">
            <img class="app-menu-app-icon" src="${icon}"></img>
            <span class="app-menu-app-title">${menu_item.title}</span>
          </div>
        `;
      }
    }
    menu_html += `
    <div class="app-menu-item ${
      localStorage.getItem("pinned") 
      && localStorage.getItem("pinned").split(",").indexOf(name) >= 0 
      && "active" || ""
    }" data-role="pin">
      <img class="app-menu-app-icon" src="common/icons/push_pin.svg"></img>
    </div>`;
    if (app.help_text) {
      menu_html += `
        <div class="app-menu-item" data-role="help">
          <img class="app-menu-app-icon" src="common/icons/info.svg"></img>
        </div>
      `;
    }
    let credits_html = "";
    if (app.contributors) {
      for (const contributor of app.contributors) {
        if (contributor.style == "namestrip") {
          credits_html += `
            <div class="app-contributor app-contributor-namestrip">
              <span class="contributor-nametag">${contributor.name}</span>
              <span class="contributor-description">${contributor.description}</span>
            </div>
          `;
        } else if (contributor.style == "text") {
          credits_html += `
            <div class="app-contributor">
              <span class="contributor-nametag">${contributor.name}</span>
              <span class="contributor-description">${contributor.description}</span>
            </div>
          `;
        }
      }
    }
    html += `
    <div class="app" data-link="${app.link || ""}" data-role="app" data-app-name="${name}">
      <div class="app-content">
        ${app.icon && `<img src="${app.icon}" style="border-color: ${app.color || "#aaa"};">` || ""}
        <div class="app-description">
          <div class="app-title-wrapper">
            <span class="app-title">${app.title}</span>
            <img class="app-title-icon" src="common/icons/arrow_forward.svg"></img>
          </div>
          <div class="app-menu">
            ${menu_html}
          </div>
        </div>
      </div>
      <div class="app-help">
        <div class="app-help-subtitle">使用说明</div>
        ${app.help_text}
        ${credits_html ? `
          <div class="app-help-subtitle">致谢</div> 
          <div class="app-contributors-container">
            ${credits_html} 
          </div>
        ` : ""}
      </div>
    </div>`;
  }
  document.querySelector(".apps-list").innerHTML = html;
  
  const elements = [
    ...document.querySelectorAll(".app"),
    ...document.getElementsByClassName("app-menu-item")
  ];
  if (elements.length) {
    for (const element of elements) {
      const data_link = element.attributes["data-link"] && element.attributes["data-link"].value;
      const data_role = element.attributes["data-role"] && element.attributes["data-role"].value;
      const parent_app = element.closest(".app");
      if (data_link) {
        element.addEventListener("click", (e) => {
          e.stopPropagation();
          // try {
          //   navigator.serviceWorker.controller.postMessage({
          //     type: "download",
          //     content: parent_app.attributes["data-link"].value
          //   });
          // } catch (e) {}
          window.location.href = data_link;
        });
      } else if (data_role == "help") {
        element.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!element.classList.contains("active")) {
            document.querySelectorAll(".app-help").forEach(element => {
              element.classList.remove("active");
            });
            element.classList.add("active");
            parent_app.querySelector(".app-help").style.display = "block";
          } else {
            element.classList.remove("active");
            parent_app.querySelector(".app-help").style.display = "none";
          }
        });
      } else if (data_role == "pin") {
        const item_id = parent_app.attributes["data-app-name"] && parent_app.attributes["data-app-name"].value;
        if (item_id) {
          element.addEventListener("click", (e) => {
            e.stopPropagation();
            let list = localStorage.getItem("pinned") ? localStorage.getItem("pinned").split(",") : [];
            if (!element.classList.contains("active")) {
              element.classList.add("active");
              parent_app.style.order = -1;
              list.push(item_id);
              localStorage.setItem("pinned", list.join(","));
              try {
                const app_name = parent_app.attributes["data-app-name"].value;
                navigator.serviceWorker.controller.postMessage({
                  type: "download",
                  content: app_name
                });
              } catch (e) {}
            } else {
              element.classList.remove("active");
              parent_app.style.order = 0;
              list = list.filter(x => x != item_id);
              if (list.length) localStorage.setItem("pinned", list.join(","));
              else localStorage.removeItem("pinned");
            }
          });
        }
      }
    }
  }
  
  const pinned_list = localStorage.getItem("pinned") ? localStorage.getItem("pinned").split(",") : [];
  if (pinned_list) {
    for (const element of document.querySelectorAll(".app") || []) {
      if (pinned_list.includes(element.attributes["data-app-name"].value)) {
        element.style.order = -1;
      }
      element.addEventListener("touchstart", (e) => {
        if (!(e.target.classList[0] && e.target.classList[0].startsWith("app-menu-item")))
          element.classList.add("selected");
      });
      element.addEventListener("touchmove", () => {
        element.classList.remove("selected");
      });
      element.addEventListener("touchend", () => {
        element.classList.remove("selected");
      });
      element.addEventListener("touchcancel", () => {
        element.classList.remove("selected");
      });
    }
  }
  for (const element of document.querySelectorAll(".app-menu-item[data-role=link]") || []) {
    element.addEventListener("touchstart", () => {
      element.classList.add("active");
    });
    element.addEventListener("touchmove", () => {
      element.classList.remove("active");
    });
    element.addEventListener("touchend", () => {
      element.classList.remove("active");
    });
    element.addEventListener("touchcancel", () => {
      element.classList.remove("active");
    });
  }
  
  for (const element of document.querySelectorAll(".app-help") || []) {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  window.updateServiceWorker = () => {};

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js', {
      scope: "./"
    }).then((e) => {
      window.updateServiceWorker = (t) => {
        t && (t.innerText = "正在检查更新...");
        e.addEventListener('updatefound', () => {
          window.location.reload();
        });
        e.update().then((reg) => {
          if (!reg.installing) t && (t.innerText = "未发现更新");
          else t && (t.innerText = "正在应用更新...");
        }).catch(() => {
          t && (t.innerText = "检查更新失败");
        });
      };
      let c = window.setInterval(() => {
        if (navigator.serviceWorker.controller) {
          window.clearInterval(c);
          // document.querySelector(".sw-progress").style.display = "block";
          // document.querySelector(".sw-progress-bar").style.display = "block";
          navigator.serviceWorker.controller.postMessage({
            type: "download",
            content: 
              ["root", "common", "trip-card"]
                .concat(localStorage.getItem("pinned") ? localStorage.getItem("pinned").split(",") : [])
                .filter((v,i,a)=>a.indexOf(v)==i)
          });
          window.setInterval(() => {
            navigator.serviceWorker.controller.postMessage({
              type: "check",
            });
          }, 4000);
        }
      }, 300);
    }).catch((e) => {
      // document.querySelector(".sw-status").innerText = "页面预加载失败";
    });
    const setCached = (item) => {
      if (!item) return;
      const app = document.querySelector(`.app[data-app-name=${item}]`);
      app && (app.querySelector(".app-title-icon").attributes.src.value = "common/icons/download_done.svg");
    };
    navigator.serviceWorker.addEventListener("message", (e) => {
      if (!e.data) return;
      if (e.data.type == "progress") {
        // const percentage = parseInt(e.data.content * 100) + "%";
        // document.querySelector(".sw-progress").innerText = percentage;
        // document.querySelector(".sw-progress").style.opacity = 0.4 + 0.6 * e.data.content;
        // document.querySelector(".sw-progress-bar-fill").style.width = percentage;
      } else if (e.data.type == "complete") {
        document.getElementById("sw-help-text").style.display = "flex";
        // document.querySelector(".sw-progress-bar-fill").style.width = "100%";
        // document.querySelector(".sw-status").innerHTML = "";
        // window.setTimeout(() => {
        //   document.querySelector(".sw-status").style.display = "none";
        // }, 2000);
        const cached_apps = e.data.content.cached;
        if (typeof(cached_apps) == "string") {
          setCached(cached_apps);
        } else {
          for (const item of cached_apps) {
            setCached(item);
          }
        }

        if (e.data.content.version) {
          document.getElementById("last-update-version").innerText = `(${e.data.content.version})`;
        }
      } else if (e.data.type == "reload") {
        window.location.reload();
      }
    });
  }

  document.getElementById("clear-local-data").addEventListener("click", () => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller)
      window.confirm('要清除全部填充信息与页面缓存吗？') && clearCache();
    else
      window.confirm('要清除全部填充信息吗？') && clearCache();
  })

  if (!(navigator.standalone || window.matchMedia("(display-mode: standalone)").matches)) {
    document.querySelector(".sw-status").innerHTML = `
      <div class="icon-align" onclick="toggleDisplay('#pwa-install-help');">
        <img class="icon" src="common/icons/add_box.svg">
        <span>全屏显示</span>
      </div>`;
  } else {
    document.querySelector(".sw-status").innerHTML = `
      <div class="icon-align" onclick="toggleDisplay('#pwa-usage-help');">
        <img class="icon" src="common/icons/help.svg">
        <span>帮助</span>
      </div>`;
  }
}

function toggleDisplay(selector, flex = false) {
  const element = document.querySelector(selector);
  if (!element) return false;
  if (!element.style.display || element.style.display == "none") {
    element.style.display = flex ? "flex" : "block";
  } else {
    element.style.display = "none";
  }
}

function clearCache() {
  localStorage.clear();
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    document.querySelector(".apps-list").innerHTML = `
      <p style="text-align: center">请稍候...</p>
    `;
    navigator.serviceWorker.controller.postMessage({
      type: "clear",
    });
  } else {
    window.location.reload();
  }
}
