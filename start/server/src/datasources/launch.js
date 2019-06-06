/*
following package 
1. helps fetch data from REST API
2. partial query caching:
- sets up an in-memory cache that caches responses from our REST resources 
- with no additional setup
*/
const { RESTDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.spacexdata.com/v2/';
    }

    async getAllLaunches() {
        const response = await this.get('launches');

        return Array.isArray(response)
        ? response.map(launch => this.launchReducer(launch))
        : [];
    }

    // map data to graph schema
    launchReducer(launch) {
        return {
          id: launch.flight_number || 0,
          cursor: `${launch.launch_date_unix}`,
          site: launch.launch_site && launch.launch_site.site_name,

          mission: {
            name: launch.mission_name,
            missionPatchSmall: launch.links.mission_patch_small,
            missionPatchLarge: launch.links.mission_patch,
          },

          rocket: {
            id: launch.rocket.rocket_id,
            name: launch.rocket.rocket_name,
            type: launch.rocket.rocket_type,
          }
        };
    }

    // take in flight num -> ret data for a specific launch
    async getLaunchById({launchId}) {
        const response = await this.get('launches', {flight_number: launchId});
        return this.launchReducer(response[0]);
    }

    getLaunchesByIds({launchIds}) {
        return Promise.all(
            launchIds.map(launchId => this.getLaunchById({launchId}))
        );
    }
}

module.exports = LaunchAPI;