
const ulEl = document.getElementById("ul-el")
const updateBtn = document.getElementById("update-btn")
const clearBtn = document.getElementById("clear-btn")
const openFormBtn = document.getElementById("open-btn")
const submitRuleBtn = document.getElementById("submit-btn")
const closeFormBtn = document.getElementById("close-btn")

update()

updateBtn.addEventListener("click", update)
clearBtn.addEventListener("click", clear)
openFormBtn.addEventListener("click", openRuleForm)
submitRuleBtn.addEventListener("click", submitRule)
closeFormBtn.addEventListener("click", closeRuleForm)

function clear() {
    chrome.storage.local.set({ "rules": JSON.stringify({}) }, function () { })
    update()
}

function update() {
    chrome.storage.local.get("rules", function (data) {
        let storedSites = JSON.parse(data.rules)
        render(storedSites)
    })

}

function render(rules) {

    let listItems = ""
    for (const rule in rules) {
        listItems += `
        <li>
            ${rule} ${rules[rule]}
        </li>
        `
    }
    ulEl.innerHTML = listItems
}

function openRuleForm() {
    document.getElementById("ruleForm").style.display = "block";
}

function submitRule() {
    const ruleUrl = document.getElementById("rule-url").value
    if (!ruleUrl) {
        alert("You must provide rule url!")
        return
    }
    const ruleTime = parseFloat(document.getElementById("rule-time").value)
    if (isNaN(ruleTime)) {
        alert("You must provide maximal time!")
        return
    }
    console.log(`url ${ruleUrl}  time ${ruleTime}`)
    chrome.storage.local.get("rules", function (data) {
        let storedRules = JSON.parse(data.rules)
        const newRule = { "url": ruleUrl, "time": ruleTime }
        storedRules[newRule.url] = newRule.time
        chrome.storage.local.set({ "rules": JSON.stringify(storedRules) }, function () { })
    })
    closeRuleForm()
    update()
}

function closeRuleForm() {
    document.getElementById("ruleForm").style.display = "none";
    document.getElementById("rule-url").value = ""
    document.getElementById("rule-time").value = ""
}