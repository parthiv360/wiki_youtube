$(document).ready(main);

function main() {
  controller.init();
}

var controller = {
  "init": function() {
    var eventHandler = function(event) {
      const EnterKey = 13;

      if (event.which == EnterKey) {
        console.log("Enter Key is Down");

        /// read the input control and then call the search function
        let searchText = view.getSearchText();

        view.searchingFor(searchText);
        view.clearSearchField();
        view.hideKeyboard();

        model.search(searchText, view);
      }
    };

    /// detect Enter Key inside the Input field
    $("#searchinput").keydown(eventHandler);
  }
};

/// view.js

const pageLink =
  '<div class = "card mb-3">' +
  '<div class = "card-block">' +
  '<div class = "card-title">' +
  '<a href="https://en.wikipedia.org/?curid={pageid}">{title}</a>' +
  "</div>" +
  '<div class = "card-text">' +
  "{extract}" +
  "</div>" +
  "</div>" +
  "</div>";

var view = {
  "renderPageInfo": function(title, pageid, extract) {
    let str_html = pageLink
      .replace("{title}", title)
      .replace("{pageid}", pageid)
      .replace("{extract}", extract);

    $("#results").append(str_html);
  },

  "getSearchText": function() {
    return $("#searchinput").val();
  },

  "clearSearchField": function() {
    $("#searchinput").val("");
    $("#results").empty();
  },

  "noPagesFound": function() {
    $("#message").append("0 pages found.");
  },

  "pagesFound": function() {
    $("#message").append("Pages found.");
  },

  "searchingFor": function(text) {
   $("#message").text('Searching for "' + text + '" ... ');
  },

  "hideKeyboard": function() {
    $("input").blur();
  }
};



var model = {
  search: function(searchText, callback_obj) {
  var buildReqData = function(searchText) {
    let uriComponent = encodeURIComponent(searchText);
    const reqTemplate =
      "action=query" +
      "&format=json&generator=search&gsrnamespace=0&gsrlimit=10&gsrsearch={text}" +
      "&prop=pageimages|extracts" +
      "&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max" +
      "&callback=?";

    return reqTemplate.replace("{text}", uriComponent);
  };

  const endPoint = "https://en.wikipedia.org/w/api.php";

  let reqData = buildReqData(searchText);

  console.log(reqData);

  let jqXmlHttpReq = $.getJSON(
    endPoint, reqData,
    (result, status, xmlHttpReq) => {
      console.log("Result:", result);
      console.log("Status:", status);
      console.log("XmlHttpReq:", xmlHttpReq);

      if (result.query === undefined) {
        callback_obj.noPagesFound();
        return;
      }

      let keys = Object.keys(result.query.pages);
      /// console.log(keys);

      keys.forEach((element, index, array) => {
        let entry = result.query.pages[element];

        callback_obj.renderPageInfo(entry.title, entry.pageid, entry.extract);

        console.log(entry);
      });
      callback_obj.pagesFound();
    }
  )
  /// this isn't doing anything in particular but good to know these are here.
  .done(() => console.log("search: done();"))
  .fail(() => console.log("search: fail();"))
  .always(() => console.log("search: always();"));

  /// this isn't doing anything in particular but good to know these are here.
  jqXmlHttpReq
    .done(() => {
      console.log("jqXmlHttpReq: done");
    })
    .fail(() => {
      console.log("jqXmlHttpReq: fail");
    })
    .always(() => {
      console.log("jqXmlHttpReq: always");
    });

  } /// end-function
}; /// end-model
