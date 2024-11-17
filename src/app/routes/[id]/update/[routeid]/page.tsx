"use client"
import React, { useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import DrawRoute from '@/components/ui/DrawRoute';
import { useParams, useRouter } from 'next/navigation'
import DynamicSectionForm from '@/components/ui/DynamicInputFields';
import dynamic from 'next/dynamic';

const DrawRouteComponent = dynamic(
  () => import('@/components/ui/DrawRoute'),
  { ssr: false }
);


const RouteForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  interface Coordinate {
    pointOrder: number;
    latitude: number;
    longitude: number;
  }

  interface RouteChannel {
    apiKey: string;
    channelId: string;
    fieldNumber: string;
  }

  interface Section {
    sectionName: string;
    apiKey: string;
    channelId: string;
    fieldNumber: string;
  }

  interface Route {
    id: number;
    routeName: string;
    routeColor: string;
    coordinates: Coordinate[];
    sections: Section[];
    routeChannel: RouteChannel
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const [routeName, setRouteName] = useState('');
  const [routeColor, setRouteColor] = useState(''); // Default color
  const [latlngs, setLatlngs] = useState<{ pointOrder: number; latitude: number; longitude: number }[]>([]);

  const [channelId, setChannelId] = useState('');
  const [fieldNumber, setFieldNumber] = useState('');
  const [apiKey, setApiKey] = useState('');

  // Dynamic Sections State
  const [sections, setSections] = useState<{ sectionName: string, apiKey: string, channelId: string, fieldNumber: string }[]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(`http://localhost:4000/routes/get-route/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: Route = await response.json();
        setRouteName(result.routeName);
        setRouteColor(result.routeColor)
        setLatlngs(result.coordinates)
        setSections(result.sections)
        setChannelId(result.routeChannel.channelId)
        setFieldNumber(result.routeChannel.fieldNumber)
        setApiKey(result.routeChannel.apiKey)
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, []);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validatePageOne = () => {
    const newErrors: { [key: string]: string } = {};
    if (!routeName) newErrors.routeName = "Route Name is required";
    if (!routeColor) newErrors.routeColor = "Route Color is required";
    if (!channelId) newErrors.channelId = "Channel ID is required";
    if (!fieldNumber) newErrors.fieldNumber = "Field Number is required";
    if (!apiKey) newErrors.apiKey = "API Key is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/routes/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        routeName,
        routeColor,
        channelId,
        fieldNumber,
        apiKey,
        coordinates: latlngs,
        sections: sections
      }),
    });

    if (response.ok) {
      router.push('/routes');
    } else {
      // Handle error
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (page === 1 && validatePageOne()) {
      setPage(2);
    } else if (page === 2) {
      setPage(3);
    }
  };



  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Section // This ensures the field is one of the keys in the Section object
  ) => {
    const newSections = [...sections];
    newSections[index][field] = e.target.value; // TypeScript knows that `field` is a valid key
    setSections(newSections);
  };

  // Add a new dynamic section
  const handleAddSection = () => {
    setSections([...sections, { sectionName: "", apiKey: "", channelId: "", fieldNumber: "" }]);
  };

  // Remove a dynamic section
  const handleRemoveSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-start container mx-auto mt-16 p-4 gap-4 h-[calc(100vh-4rem)]"
    >
      {page === 1 && (
        <div className="flex gap-20 w-full">
          {/* Route Details Section */}
          <div className="flex flex-col gap-3 w-full">
            <div className="font-semibold">Route Details</div>
            <div className="flex flex-col">
              <label htmlFor="routeName">Route Name</label>
              <input
                id="routeName"
                placeholder="e.g., Route 1"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                className="h-fit w-full p-2 border-2 rounded-md"
              />
              {errors.routeName && <span className="text-red-500">{errors.routeName}</span>}
            </div>
            <div className="flex flex-col">
              <label htmlFor="routeColor">Route Color</label>
              <input
                id="routeColor"
                placeholder="e.g., Blue"
                value={routeColor}
                onChange={(e) => setRouteColor(e.target.value)}
                className="h-fit w-full p-2 border-2 rounded-md"
              />
              {errors.routeColor && <span className="text-red-500">{errors.routeColor}</span>}
            </div>
          </div>

          {/* ThingSpeak Channels Section */}
          <div className="flex flex-col gap-3 w-full">
            <div className="font-semibold">ThingSpeak Channels</div>
            <div className="flex flex-col">
              <label htmlFor="channelId">Channel ID</label>
              <input
                id="channelId"
                placeholder="e.g., 12345"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                className="h-fit w-full p-2 border-2 rounded-md"
              />
              {errors.channelId && <span className="text-red-500">{errors.channelId}</span>}
            </div>
            <div className="flex flex-col">
              <label htmlFor="fieldNumber">Channel Field Number</label>
              <input
                id="fieldNumber"
                placeholder="e.g., 1"
                value={fieldNumber}
                onChange={(e) => setFieldNumber(e.target.value)}
                className="h-fit w-full p-2 border-2 rounded-md"
              />
              {errors.fieldNumber && <span className="text-red-500">{errors.fieldNumber}</span>}
            </div>
            <div className="flex flex-col">
              <label htmlFor="apiKey">API Key</label>
              <input
                id="apiKey"
                placeholder="e.g., XYZ123"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="h-fit w-full p-2 border-2 rounded-md"
              />
              {errors.apiKey && <span className="text-red-500">{errors.apiKey}</span>}
            </div>
          </div>
        </div>
      )}

      {page === 2 && <DrawRouteComponent onUpdateLatLngs={setLatlngs} color={routeColor} />}

      {/* Page 3: Dynamic Section Form */}
      {/* Page 3: Dynamic Section Form */}
      {page === 3 && (
        <div>
          <h2 className="font-semibold mb-4">Dynamic Sections</h2>

          {/* Render each dynamic section */}
          {sections.map((section, index) => (
            <DynamicSectionForm
              key={index}
              index={index}
              section={section}
              onInputChange={handleInputChange}
              onRemoveSection={handleRemoveSection}
            />
          ))}

          {/* Button to add a new section */}
          <button
            type="button"
            onClick={handleAddSection}
            className="bg-blue-500 text-white p-2 rounded-md mt-4 hover:bg-blue-600"
          >
            Add New Section
          </button>
        </div>
      )}


      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={handleBack}
          className={`px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 ${page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={page === 1}
        >
          Back
        </button>
        {page < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
};

export default RouteForm;
