'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../src/components/ui/Button';

export default function AdminPage() {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/get-cars');
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data = await response.json();
        setCars(data);
      } catch (err) {
        setError('Failed to load cars: ' + err.message);
      }
    };
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/delete-car?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete car');
      }
      setCars(cars.filter((c) => c.id !== id));
    } catch (err) {
      setError('Failed to delete car: ' + err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d252d 0%, #1a3c4a 100%)',
        padding: '3rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#e0f7fa',
            textAlign: 'center',
            marginBottom: '2.5rem',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            animation: 'fadeIn 0.8s ease-out forwards',
          }}
        >
          Admin Dashboard
        </h1>

        {/* Advertisement Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'row',
            gap: '2rem',
            alignItems: 'center',
            animation: 'fadeIn 1s ease-out forwards',
          }}
        >
          {/* Inline styles for responsiveness */}
          <style>
            {`
              @media (max-width: 768px) {
                .advertisement-section {
                  flex-direction: column !important;
                  padding: 1.5rem !important;
                  gap: 1.5rem !important;
                  align-items: flex-start !important;
                }
                .advertisement-image {
                  width: 100% !important;
                  max-width: 300px !important;
                  height: auto !important;
                  margin: 0 auto !important;
                }
                .advertisement-content {
                  text-align: center !important;
                }
                .advertisement-title {
                  font-size: 1.5rem !important;
                }
                .advertisement-text {
                  font-size: 1rem !important;
                }
                .advertisement-button {
                  padding: 0.5rem 1.25rem !important;
                  font-size: 0.9rem !important;
                }
              }

              @media (max-width: 480px) {
                .advertisement-section {
                  padding: 1rem !important;
                  gap: 1rem !important;
                }
                .advertisement-image {
                  max-width: 250px !important;
                }
                .advertisement-title {
                  font-size: 1.25rem !important;
                }
                .advertisement-text {
                  font-size: 0.9rem !important;
                }
                .advertisement-button {
                  padding: 0.5rem 1rem !important;
                  font-size: 0.85rem !important;
                }
              }
            `}
          </style>

          {/* Advertisement Section with classNames for targeting */}
          <div className="advertisement-section" style={{ display: 'inherit', flexDirection: 'inherit', gap: 'inherit', alignItems: 'inherit', padding: 'inherit' }}>
            <img
              className="advertisement-image"
              src="/images/1.png"
              alt="Toyota RAV4 Promotion"
              style={{
                width: '300px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <div className="advertisement-content" style={{ flex: 1, color: '#e0f7fa' }}>
              <h2
                className="advertisement-title"
                style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  color: '#00bcd4',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                }}
              >
                Drive the Future with Toyota RAV4!
              </h2>
              <p
                className="advertisement-text"
                style={{
                  fontSize: '1.1rem',
                  marginBottom: '1rem',
                  color: '#b0bec5',
                  lineHeight: '1.5',
                }}
              >
                Unleash your drive with the 2025 Toyota RAV4! Now available with 0% APR for 36 months and a free maintenance package for the first year. Don’t miss out on this limited-time offer—stock is moving fast!
              </p>
              <Button
                className="advertisement-button"
                style={{
                  background: 'linear-gradient(90deg, #ff6f61 0%, #ff3d00 100%)',
                  color: '#fff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                  boxShadow: '0 4px 15px rgba(255, 111, 97, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 111, 97, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 111, 97, 0.3)';
                }}
                onClick={() => window.open('https://www.toyota.com/rav4', '_blank')}
              >
                Explore Now
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <p
            style={{
              color: '#f44336',
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            {error}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '2rem',
          }}
        >
          <Link href="/admin/add">
            <Button
              style={{
                background: 'linear-gradient(90deg, #00bcd4 0%, #0288d1 100%)',
                color: '#fff',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 188, 212, 0.3)',
                ':hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 188, 212, 0.5)',
                },
              }}
            >
              Add New Car
            </Button>
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          }}
        >
          {cars.length === 0 ? (
            <p
              style={{
                color: '#b0bec5',
                textAlign: 'center',
                gridColumn: '1 / -1',
              }}
            >
              No cars available.
            </p>
          ) : (
            cars.map((car) => (
              <div
                key={car.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  animation: 'fadeIn 0.6s ease-out forwards',
                  ':hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <img
                  src={car.primary_image || '/uploads/cars/default.jpg'} // Updated to use primary_image
                  alt={`${car.make} ${car.model}`}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '0.75rem',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                  onError={(e) => { e.target.src = '/uploads/cars/default.jpg'; }} // Added fallback for image loading errors
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#00bcd4',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {car.make} {car.model}
                    </h2>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: '#b0bec5',
                      }}
                    >
                      Year: {car.year} | {car.condition ? car.condition.charAt(0).toUpperCase() + car.condition.slice(1) : 'N/A'}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                    }}
                  >
                    <Link href={`/admin/edit/${car.id}`}>
                      <Button
                        style={{
                          backgroundColor: '#00bcd4',
                          color: '#fff',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease, background-color 0.3s ease',
                          ':hover': {
                            backgroundColor: '#0288d1',
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDelete(car.id)}
                      style={{
                        backgroundColor: '#f44336',
                        color: '#fff',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, background-color 0.3s ease',
                        ':hover': {
                          backgroundColor: '#d32f2f',
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}