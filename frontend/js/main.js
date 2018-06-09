(function(){
	var index = 0;

    // Vertical Timeline - by CodyHouse.co
	function VerticalTimeline( element ) {
		this.element = element;
		this.blocks = this.element.getElementsByClassName("js-cd-block");
		this.images = this.element.getElementsByClassName("js-cd-img");
		this.contents = this.element.getElementsByClassName("js-cd-content");
		console.log(this.blocks[0])
		this.offset = 0.8;
		this.hideBlocks();
	};

	VerticalTimeline.prototype.hideBlocks = function() {
		//hide timeline blocks which are outside the viewport
		if ( !"classList" in document.documentElement ) {
			return;
		}
		var self = this;
		for( var i = 0; i < this.blocks.length; i++) {
			(function(i){
				if( self.blocks[i].getBoundingClientRect().top > window.innerHeight*self.offset ) {
					self.images[i].classList.add("cd-is-hidden"); 
					self.contents[i].classList.add("cd-is-hidden"); 
				}
			})(i);
		}
	};

	VerticalTimeline.prototype.showBlocks = function() {
		if ( ! "classList" in document.documentElement ) {
			return;
		}
		var self = this;
		for( var i = 0; i < this.blocks.length; i++) {
			(function(i){
				if( self.contents[i].classList.contains("cd-is-hidden") && self.blocks[i].getBoundingClientRect().top <= window.innerHeight*self.offset ) {
					// add bounce-in animation
					self.images[i].classList.add("cd-timeline__img--bounce-in");
					self.contents[i].classList.add("cd-timeline__content--bounce-in");
					self.images[i].classList.remove("cd-is-hidden");
					self.contents[i].classList.remove("cd-is-hidden");
					if ( self.blocks.length -1 == i) {
						console.log("bittttiiiiii")
						getStones();
					}
				}

			})(i);
		}
	};

	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	
	var unixtToDate = function(unixTime) {
		var date = new Date(unixTime*1000);
		formattedDate = date.getDay() + " " + monthNames[date.getMonth()] + " " + date.getFullYear(); 
		return formattedDate;
	}

	var createElement = function(element) {
		var container = document.createElement("div")
		container.className = "cd-timeline__block js-cd-block";

		var imageContainer = document.createElement("div");
		imageContainer.className = "cd-timeline__img cd-timeline__img--picture js-cd-img"
		imageContainer.style.backgroundColor = (element.color == undefined) ? imageContainer.style.backgroundColor : element.color;
		imageContainer.innerHTML = "<img src='"+element.icon+"'>";

		var contentContainer = document.createElement("div");
		contentContainer.className = "cd-timeline__content js-cd-content";
		var title = "<h2>"+element.title+"</h2>";
		var content = "<p>"+element.shortBody+"</p>";
		if (element.body != undefined) {
			content += "<a href='item.html?id="+element._id+"' class='cd-timeline__read-more'>Read more</a>";
		}
		var date = "<span class='cd-timeline__date'>"+unixtToDate(element.date)+"</span>";
		contentContainer.innerHTML = (title + content + date);

		container.appendChild(imageContainer);
		container.appendChild(contentContainer);

		return container;
	}

	var verticalTimelines = document.getElementsByClassName("js-cd-timeline"),
		verticalTimelinesArray = [],
		scrolling = false;

	var addNewStones = function(stones) {
		var tempDiv = document.createElement("div");
		for( var i = 0; i < stones.length; i++) {
			element = createElement(stones[i]);
			tempDiv.appendChild(element);
		} 
		document.getElementById("main_container").appendChild(tempDiv)
		verticalTimelinesArray.push(new VerticalTimeline(tempDiv));

		//show timeline blocks on scrolling
		window.addEventListener("scroll", function(event) {
			if( !scrolling ) {
				scrolling = true;
				(!window.requestAnimationFrame) ? setTimeout(checkTimelineScroll, 250) : window.requestAnimationFrame(checkTimelineScroll);
			}
		});
	}

	var getStones = function() {
		var xmlhttp = new XMLHttpRequest();
		var url = "http://localhost:8000/lastest?startFrom="+index;

		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var allStones = JSON.parse(this.responseText);
				index += allStones.length;
				addNewStones(allStones);
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

	function checkTimelineScroll() {
		verticalTimelinesArray.forEach(function(timeline){
			timeline.showBlocks();
		});
		scrolling = false;
	};

	getStones();
})();