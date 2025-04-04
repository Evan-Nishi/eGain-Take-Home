class DialogNode {
    /**
     * Single dialog option in tree
     * @param {string} response - the text of the dialog
     * @param {string} defaultMessage - the error text to be displayed if the user has unexpected input
     * @param {Map} choices - the keyword being searched for as index, the next node as value
     */
    constructor(response, defaultMessage, choices = new Map()){
        this.response = response;
        this.choices = choices;
        this.defaultMessage = defaultMessage;
    }

    addNode(searchTerm, nextNode){
        this.choices.set(searchTerm, nextNode);
    }
}


export class ResultNode {
    /**
     * Leaf node that is a recommendation result
     */

    constructor(knifeName, url, imgUrl, brand){
        this.name = knifeName
        this.url = url
        this.brand = brand
        this.imgUrl = imgUrl
    }
}


/**
 * Given more time I would implement an easier way to do this via a DB like Postgres to automatically build the tree
 */

//populates descision tree object DFS style to export to UI
let defaultMsgTemplate = "Sorry, I can't understand.  Can you please"

let dialogRoot = new DialogNode(
    "",
    defaultMsgTemplate + " pick either \"prep\", \"fine details\", or \"general\" type of knife?"
)


//if they pick fine details
let paringSuggestion = new ResultNode(
    "Paring",
    "https://www.victorinox.com/en-US/Products/Cutlery/Paring-Knives/Swiss-Classic-Paring-Knife/p/6.7603?cq_src=google_ads&cq_cmp=21257814892&cq_term=&cq_plac=&cq_net=x&cq_plt=gp&gclsrc=aw.ds&gad_source=1&gclid=Cj0KCQjwhr6_BhD4ARIsAH1YdjD2BnfeeZCt-lM5H-8D6p9oSe5DsDP4SYdIBZY_b_Gjh7I4d-_hTRwaAuU2EALw_wcB",
    "https://media.victorinox.com/transform/66d9891d-ba72-4af6-b3ad-fd79ada87bd8/CUT_6_7401__S1-tif?io=transform%3Afit%2Cwidth%3A400%2Cheight%3A320&quality=80",
    "Victorinox"
)
dialogRoot.addNode("details", paringSuggestion)
dialogRoot.addNode("fine", paringSuggestion)

//if they pick general cooking
let generalNode = new DialogNode(
    "Is your cutting area limited in space?",
    defaultMsgTemplate + " pick either \"yes\" or \"no\"?"
)
dialogRoot.addNode("general", generalNode)

//if they pick yes, recommend santoku
let santokuSuggestion = new ResultNode(
    "Santoku",
    "https://www.mercerculinary.com/product/genesis-granton-edge-santoku-7-17-8-cm/",
    "https://www.mercerculinary.com/wp-content/uploads/2018/11/M20707.jpg",
    "Mercer"
);
generalNode.addNode("yes", santokuSuggestion)
generalNode.addNode("yep", santokuSuggestion)
generalNode.addNode("yea", santokuSuggestion)
generalNode.addNode("definitely", santokuSuggestion)

//if they pick no then advance them to final question
let styleNode = new DialogNode(
    "Do you like Japanese or European style knives?",
    defaultMsgTemplate + " pick either \"Japanese\" or \"European\"?"
)
generalNode.addNode("no", styleNode)
generalNode.addNode("nope", styleNode)
generalNode.addNode("not", styleNode)



//if they pick Japanese suggest them a Gyuto  
let gyutoSuggestion = new ResultNode(
    "Gyuto",
    "https://www.chefknivestogo.com/todpchkn18.html",
    "https://s.turbifycdn.com/aah/chefknivestogo/tojiro-dp-gyuto-180mm-442.png",
    "Tojiro"
);
styleNode.addNode("japanese", gyutoSuggestion)

 

//if they pick European suggest them a Chef's knife
let chefsSuggestion = new ResultNode(
    "Chef's",
    "https://www.wusthof.com/products/wusthof-classic-6-cooks-knife-1040100116?variant=Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80MjU2NzgyMTcyMTc1MQ==&queryID=99a010193bfa898243044ccef72759b2",
    "https://cdn.shopify.com/s/files/1/0372/6232/7941/files/1040100116-6inCooksKnife.png?v=1722875380",
    "Wüsthof"
);
styleNode.addNode("european", chefsSuggestion)


//if they choose prep
let prepNode = new DialogNode(
    "Now will you be preparing a lot of meat or vegetables?",
    defaultMsgTemplate + " pick either \"meat\" or \"vegetables\" for usage?"
)
//prepare, prep and preparation all point to same node
dialogRoot.addNode("prep", prepNode)
dialogRoot.addNode("prepare", prepNode)
dialogRoot.addNode("preperation", prepNode)

//if they choose meat
let meatNode = new DialogNode(
    "What type of meat will you be preparing?  Fish, poultry, or red meat?",
    defaultMsgTemplate + " pick either \"fish\", \"poultry\",  or \"red\"?"
)
prepNode.addNode("meat", meatNode)


//if fish is chosen
meatNode.addNode("fish", new ResultNode(
    "Fillet",
    "https://www.victorinox.com/en-US/Products/Cutlery/Chef%27s-Knives/Grand-Ma%C3%AEtre-Wood-Filleting-Knife/p/7.7210.20G?cq_src=google_ads&cq_cmp=21257814892&cq_term=&cq_plac=&cq_net=x&cq_plt=gp&gclsrc=aw.ds&gad_source=1&gclid=Cj0KCQjwhr6_BhD4ARIsAH1YdjCD_a-gU5PfkHiLNwJlZWeUVtehCIIIQ0YalYS3U6a62Lr4Q5GR42gaArnpEALw_wcB",
    "https://media.victorinox.com/transform/04ae780e-f2cf-4ce9-93c3-f666170ed6b0/CUT_7-7210-20_S1-jpg?io=transform%3Abackground%2Ccolor%3AF0F0F0&io=transform%3Afit%2Cwidth%3A1100%2Cheight%3A830&quality=80",
    "Victorinox"
))

//since cleaver is used twice
let cleaverSuggestion = new ResultNode(
    "Cleaver",
    "https://www.williams-sonoma.com/products/wusthof-classic-cleaver-knife/?catalogId=79&sku=33688&cm_ven=PLA&cm_cat=Google&cm_pla=Cutlery%20%3E%20Cleavers%2C%20Boning%20%26%20Filet%20Knives&cm_ite=33688_14571727833_pla-369360804174&gad_source=1&gclid=Cj0KCQjwhr6_BhD4ARIsAH1YdjDekLiC0lp50VWipsi3TA87CXEpxJMHeldrFw1qxw88jIPI-SspiY4aAlYQEALw_wcB",
    "https://assets.wsimgs.com/wsimgs/ab/images/dp/wcm/202443/0012/img416xl.jpg",
    "Wüsthof"
)
prepNode.addNode("both", cleaverSuggestion)


//if red meat is chosen
meatNode.addNode("red", cleaverSuggestion)


//if poultry is chosen
let poultrySuggestion = new ResultNode(
    "Poultry",
    "https://www.montanaknifecompany.com/products/boning-butcher-black?variant=41210053918833&country=US&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&gad_source=1&gclid=Cj0KCQjwhr6_BhD4ARIsAH1YdjAPDn2LM26VwJVmMr-JzG012uYbugsSsTpu5Ocx8JaudwNIUVYgV90aAqLNEALw_wcB",
    "//www.montanaknifecompany.com/cdn/shop/files/001-BEARDEDBUTCHERSBONING-B.jpg?v=1740087531&width=3000",
    "MKC"
)
meatNode.addNode("chicken", poultrySuggestion)
meatNode.addNode("poultry", poultrySuggestion)
meatNode.addNode("bird", poultrySuggestion)


//if they choose veg
let vegNode = new DialogNode(
    "Will you be preparing lots of bulky vegetables?",
    defaultMsgTemplate + " pick either \"yes\" or \"no\"?"
)
prepNode.addNode("vegetables", vegNode)
prepNode.addNode("veg", vegNode)
prepNode.addNode("veggies", vegNode)

//if they do cut a lot of bulky veg then suggest cleaver
vegNode.addNode("yes", cleaverSuggestion)
vegNode.addNode("yep", cleaverSuggestion)
vegNode.addNode("yea", cleaverSuggestion)
vegNode.addNode("definitely", cleaverSuggestion)

//else, recommend nakiri
let nakiriSuggestion = new ResultNode(
    "Nakiri",
    "https://www.chefknivestogo.com/mabl2nana16.html",
    "https://s.turbifycdn.com/aah/chefknivestogo/matsubara-blue-2-nashiji-nakiri-165mm-599.png",
    "Matsubara"
)
vegNode.addNode("no", nakiriSuggestion)
vegNode.addNode("nope", nakiriSuggestion)
vegNode.addNode("not", nakiriSuggestion)

export default dialogRoot;