# IPv4SubnetTool

A small JavaScript-based web application that calculates the network, broadcast, and usable addresses given an IP address and a netmask or CIDR value. Binary representations of the address and netmask are viewable. Also shows the network before and after the selected network, as well as browsing through the adjacent networks.

## Background

I got tired of calculating these details in my head and wanted a quick tool that was reachable from anywhere. As the functionality is completely JavaScript based, it also runs fine by just opening the index page locally.

## Hosting and Privacy

A public version of the tool is hosted at https://ip.iceborn.ca. The server is configured with redirects so that if you go to ip.iceborn.ca/<ip>/<CIDR> (ie: https://ip.iceborn.ca/8.8.8.8/24) you'll be taken directly to that network. The redirect provides the GET variables ip= and c= which are loaded by JavaScript when present.

Although the tool doesn't require any communication with the server once the page is loaded, if you are ultra security-conscious and don't want IPs logged, be aware that using the redirect or accessing the page directly with your own GET variables will be logged by the server. Once the page is loaded, any adjustments are not submitted to the server or logged.

## License

The IPv4SubnetTool is provided under the MIT License described [here](https://raw.githubusercontent.com/Optimoos/IPv4SubnetTool/master/LICENSE).
