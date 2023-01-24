# Routing

## Conceptual Structure

Our application is built on a triple-nested navigation structure. This may seem complex at first, but our UI requires this structure. Our navigation is built on the following structure:

### Root Stack Navigator

The Root Stack provides the shallowest level of navigation over our application. Its primary responsibility is providing an "escape route" from our main Bottom Tab Navigator. It consists of a single Bottom Tab Navigator and a collection of utility screens that should navigate away from the main application such as "Settings", and "Tutorial". Its configuration can be found in the `root` folder.

### Bottom Tab Navigator

The Bottom Tab Navigator is the most significant navigator in our application. It provides a screen for each tab in the bottom tray of our screen. Each of these screens then constructs a Tab Stack.

### Tab Stack Navigator

Tab Stacks can be found within each of the Bottom Tabs. A given Tab Stack should contain all screens that will be navigated to from this tab. For example, the `profile` might contain the following screens as a subset {"Profile", "Sends", "Following", "Followers"}.

## Data Structure

As this is a complicated structure, we must maintain good organization. There are several folders in this directory, each containing three files.

`names.ts` - Stores a list of all valid screen names in this navigator

`paramList.ts` - Stores a mapping of a screen name to its parameter list.

`routes.ts` - Stores a mapping of a screen name to its component.

Finally, there is a `routes.ts` in this directory that aggregates all of the information from subdirectories into a single export.
