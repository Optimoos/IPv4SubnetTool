//jshint esversion:6

var ipv4_octs = [ ];
var ipv4addr_color = "";
var cidr = 24;

var b_co_ip = "";
var b_net = "";
var b_broad = "";

var t_add = "";
var t_net = "";
var t_broad = "";
var t_usable = "";

var a_co_ip = "";
var a_net = "";
var a_broad = "";

const maxbin = '01111111111111111111111111111111';
// bitwise OR converts maxint to unsigned int
const maxint = (parseInt(maxbin, 2) | 0);
const minbin = '10000000000000000000000000000000';
const minint = (parseInt(minbin, 2) | 0);

function updatePage() {
	if (validateIPv4(document.getElementById("ipv4add").value) === false) {
		return;
	}
	let bin_addr = ipv4DottedToBinary(ipv4_octs);
	let int_addr = parseInt(bin_addr,2);
	let int_mask = parseInt(cidrToBinMask(cidr),2);
	
	t_net = num2dot(getNetwork(int_addr, int_mask));
	t_broad = num2dot(getBroadcast(int_addr, int_mask));
	t_usable = getUsable(cidr);
	
	if ((int_addr-1 & int_mask) === 0) {
		b_co_ip = "None exists";
		b_net = "N/A";
		b_broad = "N/A";
	} else {
		let int_b_co_ip = getBefore(int_addr-1, int_mask);
		b_co_ip = num2dot(int_b_co_ip);
		b_net = num2dot(getNetwork(int_b_co_ip, int_mask));
		b_broad = num2dot(getBroadcast(int_b_co_ip, int_mask));
	}
	
	if ((int_addr & int_mask) === (int_mask | 0)) {
		a_co_ip = "None exists";
		a_net = "N/A";
		a_broad = "N/A";
	} else {
		let int_a_co_ip = getAfter(int_addr, int_mask);
		a_co_ip = num2dot(int_a_co_ip);
		a_net = num2dot(getNetwork(int_a_co_ip, int_mask));
		a_broad = num2dot(getBroadcast(int_a_co_ip, int_mask));
	}

	document.getElementById("cidr_slider").value = cidr;
	document.getElementById("cidr").value = cidr;	
	document.getElementById("netmask").value = num2dot(int_mask);
	document.getElementById("t_add").textContent = t_add;
	document.getElementById("t_net").textContent = t_net;
	document.getElementById("t_broad").textContent = t_broad;
	document.getElementById("t_usable").textContent = t_usable;

	document.getElementById("t_bin_add").textContent = bin_addr;
	document.getElementById("t_bin_net").textContent = ipv4DottedToBinary(num2dot(int_mask).split("."));
	
	document.getElementById("b_co_ip").textContent = b_co_ip;
	document.getElementById("b_net").textContent = b_net;
	document.getElementById("b_broad").textContent = b_broad;
	
	document.getElementById("a_co_ip").textContent = a_co_ip;
	document.getElementById("a_net").textContent = a_net;
	document.getElementById("a_broad").textContent = a_broad;

	
}

function num2dot(num) 
{
    return ( (num>>>24) +'.' +
        (num>>16 & 255) +'.' +
        (num>>8 & 255) +'.' +
        (num & 255) );
}

function cidrSlider() {
	cidr = parseInt(document.getElementById("cidr_slider").value);
	updatePage();
}

function updateNetmask() {
	if (/^(255|252|248|240|224|192|128|64|0)\.(255|252|248|240|224|192|128|64|0)\.(255|252|248|240|224|192|128|64|0)\.(255|252|248|240|224|192|128|64|0)$/.test(document.getElementById("netmask").value)) {
		let c_mask = document.getElementById("netmask").value;
		let b_mask = ipv4DottedToBinary(c_mask.split("."));
		
		if (b_mask.slice(b_mask.indexOf("0"), b_mask.length-1).includes("1")) {
			document.getElementById("netmask").className += " error";
			document.getElementById("ipv4add").disabled=true;
			document.getElementById("cidr_slider").disabled=true;
			document.getElementById("cidr").disabled=true;
		} else {
			document.getElementById("netmask").className = "";
			document.getElementById("ipv4add").disabled=false;
			document.getElementById("cidr_slider").disabled=false;
			document.getElementById("cidr").disabled=false;			
			let t_arr = b_mask.split("1");
			cidr = t_arr.length-1;
			
			updatePage();
		}
	} else {
		document.getElementById("netmask").className += " error";
		document.getElementById("ipv4add").disabled=true;
		document.getElementById("cidr_slider").disabled=true;
		document.getElementById("cidr").disabled=true;		
	}
}

function ipv4DottedToBinary(octArray) {
	let binAddr = '';
	for (let i=0; i<octArray.length; i++) {
		binAddr += binaryStringPad(parseInt(octArray[i]).toString(2), 8);
	}
	return binAddr;
}

function binaryStringPad(b_str, b_bits) {
	while (b_str.length < b_bits) {
		b_str = "0" + b_str;
	}
	return b_str;
}

function cidrToBinMask(c) {
	let mask = '';
	for (let i=0;i<c;i++) {
		mask += "1";
	}
	while (mask.length < 32) {
		mask += "0";
	}
	return mask;
}

function getNetwork(int_a, int_m) {
	return (int_a & int_m);
}

function getBroadcast(b_addr, b_mask) {
	return (b_addr | ~ b_mask);
}

function getUsable(c) {
	switch(parseInt(c)) {
	case 0:
		return "All addresses";
	case 31:
		return "2 - Point-to-point only";

	case 32:
		return "1 - Host address";
	default:
		return ((maxint >>> (cidr-1)) - 1);
	}
}

function getBefore(i_addr, i_mask) {
	return (i_addr - ~ i_mask);
}

function getAfter(i_addr, i_mask) {
	return i_addr + ~ i_mask + 1;
}

function goBefore() {
	if (!b_co_ip.includes("None")) {
		document.getElementById("ipv4add").value = b_co_ip;
		updateIPv4();
	}
}

function goAfter() {
	if (!a_co_ip.includes("None")) {
		document.getElementById("ipv4add").value = a_co_ip;
		updateIPv4();	
	}
}	

function validateIPv4(addr) {
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(addr)) {
		return true;
	}  
	return false;
}

function updateIPv4() {
	if (validateIPv4(document.getElementById("ipv4add").value) === false) {
		//Invalid input, set form red
		document.getElementById("ipv4add").className += " error";
		document.getElementById("netmask").disabled=true;
		document.getElementById("cidr_slider").disabled=true;
		document.getElementById("cidr").disabled=true;
		return false;
	} else {
		document.getElementById("ipv4add").className = "";
		document.getElementById("netmask").disabled=false;
		document.getElementById("cidr_slider").disabled=false;
		document.getElementById("cidr").disabled=false;
		t_add = document.getElementById("ipv4add").value;
		ipv4_octs = t_add.split(".");
		updatePage();
		return true;
	}
}

function showBinary() {
	var binaryDiv = document.getElementById("network-binary");
	if (binaryDiv.style.display === "none") {
		binaryDiv.style.display = "block";
	} else {
		binaryDiv.style.display = "none";
	}
}

function main() {
	var url = new URL(window.location.href);
	
	document.getElementById("network-binary").style.display = "none";
	
	if (/^[0-9]?[0-9]$/.test(url.searchParams.get("c"))) {
		cidr = url.searchParams.get("c");
		document.getElementById("cidr").value = cidr;
	}
	
	if (validateIPv4(url.searchParams.get("ip"))) {
		document.getElementById("ipv4add").value = url.searchParams.get("ip");
	}
	
	if (document.getElementById("ipv4add").value === "") {
		document.getElementById("ipv4add").value = "1.1.1.1";
	}

	updateIPv4();
	ipv4addr_color = document.getElementById("ipv4add").style.backgroundColor;
	cidr = document.getElementById("cidr_slider").value;
	document.getElementById("cidr").value = cidr;
}

window.onload = function() {
	main();
};
