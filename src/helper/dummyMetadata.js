export const DUMMY_APR_METADATA = {
	name: "PRM APR",
	server: "http://localhost:60000/api/data",
	// Will help the server 
	requestTypes: [
		{
			name: "GetOverallKpi",
			// Put the description in a tooltip, to that user/engineer will know which one to choose
			description: "For Overall ODE, PRM readiness status, ISAE readiness status"
		},
		{
			// For image map
			name: "GetPlantKpi",			
			description: "For getting plant KPI"
		},		
		{
			name: "GetDeviceDetails",
			description: "For querying device details only, without groupings/aggregations"
		},
		{
			name: "GetDeviceCounts",
			description: "For performing aggregations on Device"
		},
		{
			name: "GetDeviceTrendValues",
			description: "For line charts, e.g. getting ODE/TA/PA for each month/week/day/year"
		},
		{
			name: "GetAlarmDetails",
			description: "For querying the alarm properties"
		},
		{
			name: "GetAlarmCounts",
			description: "For performing aggregations on Alarms"
		},
		{
			name: "GetAlarmTrendValues",
			description: "For line charts, e.g. number of alarms per month/week/year"
		},
	],
	
	requestParams: [
		// Place here the user inputs that are not part of the dimensions
		{
			// Let the user select/modify the Analysis Period when viewing the pages
			name: 'AnalysisPeriod',   
			dataTypes: ['Date Range'],   
			enumValues: ['Latest value only', 'Last 1 day', 'Last 7 days', 'Last 30 days', 'Custom Range']
		},
	],
	// the groupings is for UI organization only.
	// the important thing is that all the names must be unique
	// all unique names must be recognized by the backend
	dimensions: [
		{
			// Put here the Device properties that don't normally change frequently
			name: "Device Properties",
			dataType: "group",
			items: [
				{
					name: "DeviceID",
					dataType: "string",		
					aggregations: ["count"],
					// requestTypes: ["GetDeviceDetails", "GetDeviceCounts"]
				},
				{
					name: "DeviceTag",
					dataType: "string",
					aggregations: ["count"]
				},
				{
					name: "CommType",
					dataType: "string",
					aggregations: ["count"]
				},
				{
					name: "DevicePath",
					dataType: "string",
					aggregations: ["count"]
				},
				{
					name: "Category",
					dataType: "string",
					aggregations: ["count"]
				},
        {
					name: "Priority",
					dataType: "enum",
					enumValues: ["Low", "Medium", "High", "High+"],
					aggregations: ["count"]
				},
				// Just repeat for other common attributes like Device Description
				
				// Hierarchical attributes - start
				{
					// Hierarchical: so that can perform dynamic grouping in Charts
					name: "Vendor Model Info",
					dataType: "group",
					aggregations: [],
					items: [
						{
							name: "Vendor",
							dataType: "string",
							aggregations: ["count"],
							items: [
								{
									name: "Model",
									dataType: "string",
									aggregations: ["count"],
									items: [
                                        {
                                            name: "Revision",
                                            dataType: "string",							
                                            aggregations: ["count"],
                                        }
									]
								}
							]
						}
					]
				},
				{
					name: "Path",
					dataType: "group",
					aggregations: [],
					items: [
						{
							// Assume PRM Plant Hierarchy. Repeat similar structure for Network Hierarchy, Class Hierarchy etc.
							name: "Plant",
							dataType: "string",
							aggregations: ["count"],
							items: [
                                {
                                    name: "Area",
                                    dataType: "string",							
                                    aggregations: ["count"],
                                    items: [
                                        {
                                            name: "Unit",
                                            dataType: "string",
                                            aggregations: ["count"],
                                        }
                                    ]
                                }
							]
						}
					]
				}
				// Hierarchical attributes - end			
			] // END: Device Info - items
		}, // END: Device Info group
		{
			name: "Device KPI's",
			dataType: "group",
			items: [
				{
					// Repeat for TA and PA
					name: "ODE", // TODO: We can also create another group called "Device Availability"
					dataType: "group",
					items: [
						{
							name: "ODE Value", // e.g. 99.5%
							dataType: "number",
							aggregations: [], // no aggregation
						},
						{
							name: "ODE Status", // e.g. ☀ ️⛅ ☁ ️⛈ ️⚡
							dataType: "enum",
							enumValues: [1, 2, 3, 4, 5],
							aggregations: ["count"],
						},						
					]
				},
				{
					// Repeat for NE107 Device Status
					name: "Latest PRM Device Status", // TODO: We can also create another group called "Device Availability"
					dataType: "enum",
					enumValues: ['Abnormal', 'Warning', 'Communication Error', 'Uncertain', 'Normal'], // Should expect Analysis Period parameter
					aggregations: ["count"],
				},
			]
		},
		{
			name: "Alarm Info",
			dataType: "group",
			items: [
				{
					name: "Timestamp",
					dataType: "datetime",
				},
				{
					name: "StartDate",
					dataType: "datetime",
				},
				{
					name: "EndDate",
					dataType: "datetime",
				},
				{
					name: "EventType",
					dataType: "string",
					aggregations: ["count"],
				},
				{
					name: "Message",
					dataType: "string",
					aggregations: ["count"],
				},
			]
		}, // END: Alarms Info
		{
			name: "Plant KPI",
			dataType: "group",
			items: [
				{
					name: "Plant Name",
					dataType: "string",
					aggregations: ["count"],
				},
				{
					name: "Plant Type",
					dataType: "string", //e.g. PRM, ISAE
					aggregations: ["count"],
				},
				{
					name: "Plant KPI Score",
					dataType: "number"
				},
			]
		},
		{
			name: "Overall KPI",
			dataType: "group",
			items: [
				{
					name: "Total Organization KPI",
					dataType: "number",
				},
				{
					// It's in the Mockup spec...
					name: "PRM Readiness Status",
					dataType: "string", // e.g. "3/5"
				},
				{
					name: "ISAE Readiness Status",
					dataType: "string", // e.g. "0/0"
				},
				{
					name: "CurrentPhase",
					dataType: "string", // e.g. "Phase 1"
				},
				{
					name: "Plant KPI Status",
					dataType: "string", // e.g. Notmal, High Risk, Non-Visualized
				},				
			]
			
		} // END: Overall KPI
	],
};

// Keep the old dummy data just for compatibility with some obsoleted features
// DataTypes:
// [Percent]  e.g. ODE, TA, PA. Cannot be used in pie chart
// [Number]   e.g. Total Alarms. Children count can be summed up.
// [Not specified] means it is string value

// Note: this metadata set is for device-level metadata
//  TODO: We need to fetch the comment library stuff also
// We also need to define a metadata for alarm-level metadata
export const OLD_DUMMY_DATA = {
    name: 'Device Metadata',
    // Defines how other Dataset-types can link to this Dataset.
    // For example, Alarms data can be linked to this dataset via DeviceId
    // This also defines the unit of Data. Means this data has a DeviceId
    dataKey: 'DeviceId', // This should be one of the dimensions
    RequestParams: [
      {
        name: 'AnalysisPeriod',
        dataTypes: ['Date Range'],
        enumValues: ['Latest value only', 'Last 1 day', 'Last 7 days', 'Last 30 days', 'Custom Range']
      },
      // {
        // I think no need...since this is already defined in the Dimensions. We only include the "special" ones that are not inside the Dimensions
        // name: 'Path',
        // dataTypes: ['string'],
      // },    
    ],
    Dimensions: [
      {
        // TODO: Maybe we remove the Device Info layer (i.e. Vendor, Model etc are first level dimensions)
        // In a relational DB, for PRM, we need to put Device Info in another table (separate from Hierarchy table) because there can be multiple hierarchy views
        // In a noSQL DB, we can flatten this out when storing
        name: 'Device Info',
        dataTypes: ['group'],   
        // supported controls: ['pie', 'bar']
        items: [
          {
            name: 'Device ID',
            dataTypes: ['string'],
          },
          {
            name: 'Device Tag',
            dataTypes: ['string'],   
          },
          {
            name: 'Priority',
            dataTypes: ['Enum'],   
            enumValues: ['Low', 'Medium', 'High', 'High+'],
  
            // measures: to be used only in request data if client wants server to provide the calculated value already, instead of client computing for the value
            // But client can use this info to populate some ui configs?
            measures: [
              {
                name: 'Count',
                expression: 'count'
              }
            ]
          },      
          {
            name: 'Category',
            dataTypes: ['string'],   
          },           
          {
            name: 'FullPath',
            dataTypes: ['string'],   
          }        
        ]
      }, // End: Device Info group
      {
        name: 'VendorModel Info',
        dataTypes: ['group'],   
        items: [
          {
            name: 'Vendor',
            dataTypes: ['string', 'group'],
            items: [
              {
                name: 'Model',
                dataTypes: ['string'],
                items: [
                  {
                    name: 'Revision',
                    dataTypes: ['string'],
                  }
                ]    
              }
            ]
          }
        ]
      }, // End: Vendor Model group
      {
        name: 'Device Status',
        dataTypes: ['group'],
        items: [
          {
            name: 'PRM Device Status',          
            enumValues: ['Abnormal', 'Warning', 'Communication Error', 'Uncertain', 'Normal'],
            dataTypes: ['Enum']
          },
          {
            name: 'NE107 Device Status',          
            enumValues: ['Failure', 'Check Function', 'Out of Specification', 'Maintenance Required', 'Communication Error', 'Unknown,Normal'],
            dataTypes: ['Enum']
          },
        ]
      },
      {
        name: 'Device Status Timing Breakdown',
        dataTypes: ['group'],
        items: [
          {
            name: 'Good%',
            dataTypes: ['Percent']
          },
          {
            name: 'Bad%',
            dataTypes: ['Percent']
          },
          {
            name: 'Fair%',
            dataTypes: ['Percent']
          },
          {
            name: 'Uncertain%',
            dataTypes: ['Percent']
          },
        ]
      },
      {
        name: 'Device Availability',
        value: 'Device Availability',
        items: [
          {
            name: 'ODE',
            items: [
              {
                name: 'Status',
                dataTypes: ['Enum'],
                enumValues: [1, 2, 3, 4, 5], // These are these nameless icons in FA KPI ☀️⛅☁️⛈️⚡
              },
              {
                name: 'Value',
                dataTypes: ['Number'],
              }
            ]          
          },
          {
            name: 'TA',
            items: [
              {
                name: 'Status',
                dataTypes: ['Enum'],
                enumValues: [1, 2, 3, 4, 5], // These are these nameless icons in FA KPI ☀️⛅☁️⛈️⚡
              },
              {
                name: 'Value',
                dataTypes: ['Number'],
              }
            ]          
          },
          {
            name: 'PA',
            items: [
              {
                name: 'Status',
                dataTypes: ['Enum'],
                enumValues: [1, 2, 3, 4, 5], // These are these nameless icons in FA KPI ☀️⛅☁️⛈️⚡
              },
              {
                name: 'Value',
                dataTypes: ['Number'],
              }
            ]          
          },
        ]
      },
      {
        name: 'Alarm Info',
        value: 'Alarm Info',
        items: [
          {
            name: 'Alarm Frequency',
            dataTypes: ['Number']
          },
          {
            name: 'AE Occurring',
            dataTypes: ['Boolean']
          },
          {
            name: 'Raw Alarms',
            dataTypes: ['Annotation']
          },
        ]
      },
  
      {
        // Also possible: Network Path, class Path etc.
        // For ISAE case, might not be possible since the hierarchy is not strucured
        // So for ISAE case, it will just be single level Path
        name: 'Path', // Assume Plant Path for now
        value: 'Path',
        items: [
          {
            name: 'Plant', //e.g. MYPJT
            dataTypes: ['string', 'group'],
            items: [
              {
                name: 'Site',
                dataTypes: ['string', 'group'],
                items: [
                  {
                    name: 'Area',
                    dataTypes: ['string', 'group'],
                    items: [
                      {
                        name: 'Unit',
                        dataTypes: ['string'],
                      },
                    ]
                  },
                ]
              },
            ]
          },
        ]
      },  
    ]
  };
  
  const alarmsDummyMetadata = {
    name: 'Alarms Metadata',
    dataKey: 'alarmId', // null, if it's not available. Means this is not open for 'extension'
    RequestParams: [
      {
        // If this is the only parameter, retrievea all the alarms from within the Analysis Period
        // TODO: Consider adding a 'required' flag
        name: 'AnalysisPeriod',   
        dataTypes: ['Date Range'],   
        enumValues: ['Last 1 day', 'Last 7 days', 'Last 30 days', 'Custom Range']
      },
      {
        // Sample only -- no need to declare this as Device Id is already part of the Dimensions
        // name: 'Device Id',   
        // dataTypes: ['string'],   
      },
      {
        name: 'RequestKey',
        dataTypes: ['string'],   
      }
    ],
    Dimensions: [
      {
        name: 'Timestamp',
        dataTypes: ['Datetime']
      },
      {
        name: 'Start Date',
        dataTypes: ['Datetime']
      },
      {
        name: 'End Date',
        dataTypes: ['Datetime']
      },
      {
        name: 'Event Type',
        dataTypes: ['string']
      },
      {
        name: 'Message',
        dataTypes: ['string']
      },
  
    ]
  }
  
  const allDummyMetadata = [];


  export const dropdownOptions = [
    { key: 'angular', text: 'Angular', value: 'angular' },
    { key: 'css', text: 'CSS', value: 'css' },
    { key: 'design', text: 'Graphic Design', value: 'design' },
    { key: 'ember', text: 'Ember', value: 'ember' },
    { key: 'html', text: 'HTML', value: 'html' },
    { key: 'ia', text: 'Information Architecture', value: 'ia' },
    { key: 'javascript', text: 'Javascript', value: 'javascript' },
    { key: 'mech', text: 'Mechanical Engineering', value: 'mech' },
    { key: 'meteor', text: 'Meteor', value: 'meteor' },
    { key: 'node', text: 'NodeJS', value: 'node' },
    { key: 'plumbing', text: 'Plumbing', value: 'plumbing' },
    { key: 'python', text: 'Python', value: 'python' },
    { key: 'rails', text: 'Rails', value: 'rails' },
    { key: 'react', text: 'React', value: 'react' },
    { key: 'repair', text: 'Kitchen Repair', value: 'repair' },
    { key: 'ruby', text: 'Ruby', value: 'ruby' },
    { key: 'ui', text: 'UI Design', value: 'ui' },
    { key: 'ux', text: 'User Experience', value: 'ux' },
    { key: 'test1', text: 'A quick brown fox jumps over the lazy dog', value: 'test1' },
    { key: 'test2', text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+', value: 'test2' },
    { key: 'test3', text: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', value: 'test3' },
  ];
  
export const dropdownOptionsFew = [
    { key: 'apple', text: 'Apple', value: 'apple' },
    { key: 'banana', text: 'Banana', value: 'banana' },
    { key: 'carrot', text: 'Carrot', value: 'carrot' },
    { key: 'dolphin', text: 'Dolphin', value: 'dolphin' },
    { key: 'elephant', text: 'Elephant', value: 'elephant' },
    { key: 'fish', text: 'Fish', value: 'fish' },
    { key: 'grapefruit', text: 'Grapefruit', value: 'grapefruit' },
    { key: 'hummingbird', text: 'Humming Bird', value: 'hummingbird' },
    { key: 'iguana', text: 'Iguana', value: 'iguana' },
  ];
