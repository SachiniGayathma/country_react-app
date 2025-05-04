// AllCountries.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AllCountries from '../components/AllCountries'; // Import your component
import axios from 'axios';


jest.mock('axios');

describe('AllCountries', () => {
  it('should fetch and display countries when searchQuery is set', async () => {
    
    axios.get.mockResolvedValue({
      data: [
        { name: { common: 'Country1' }, flags: { png: 'flag1.png' }, population: 1000000, region: 'Asia', capital: ['Capital1'] },
        { name: { common: 'Country2' }, flags: { png: 'flag2.png' }, population: 2000000, region: 'Europe', capital: ['Capital2'] }
      ]
    });

    
    render(<AllCountries />);

    
    fireEvent.change(screen.getByPlaceholderText('Search by country name'), { target: { value: 'Country1' } });

    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/name/Country1');
      expect(screen.getByText('Country1')).toBeInTheDocument();
      expect(screen.getByText('Country2')).not.toBeInTheDocument(); 
    });
  });

  it('should fetch countries by region when selectedRegion is set', async () => {
  
    axios.get.mockResolvedValue({
      data: [
        { name: { common: 'Country1' }, flags: { png: 'flag1.png' }, population: 1000000, region: 'Asia', capital: ['Capital1'] }
      ]
    });

    // Render the component
    render(<AllCountries />);

    // Simulate user selecting a region
    fireEvent.change(screen.getByDisplayValue('All Regions'), { target: { value: 'Asia' } });

    // Wait for the API call to be triggered and for the countries to be displayed
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/region/Asia');
      expect(screen.getByText('Country1')).toBeInTheDocument();
    });
  });

  it('should show "No countries found" if no data is returned', async () => {
   
    axios.get.mockResolvedValue({ data: [] });

    
    render(<AllCountries />);

    
    fireEvent.change(screen.getByPlaceholderText('Search by country name'), { target: { value: 'NonExistingCountry' } });

    
    await waitFor(() => {
      expect(screen.getByText('No countries found.')).toBeInTheDocument();
    });
  });

  it('should handle errors when API request fails', async () => {
   
    axios.get.mockRejectedValue(new Error('Network error'));

    render(<AllCountries />);

    
    fireEvent.change(screen.getByPlaceholderText('Search by country name'), { target: { value: 'Country1' } });

    
    await waitFor(() => {
      
      expect(screen.getByText('No countries found.')).toBeInTheDocument();
    });
  });
});
