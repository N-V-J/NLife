import { Row, Col, Typography, Card, Rate, Avatar } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      avatar: '',
      rating: 5,
      comment: 'NLife made booking my appointment so easy! The doctors are professional and the platform is user-friendly. Highly recommend for anyone looking for quality healthcare.',
      location: 'New York'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Software Engineer',
      avatar: '',
      rating: 5,
      comment: 'I was impressed by the quick response time and the quality of care I received. The online booking system saved me so much time. Excellent service!',
      location: 'California'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Teacher',
      avatar: '',
      rating: 5,
      comment: 'The telemedicine feature is a game-changer! I could consult with a specialist from home. The doctors are knowledgeable and caring. Thank you NLife!',
      location: 'Texas'
    }
  ];

  return (
    <section style={{
      padding: '80px 0',
      background: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <Title level={2} style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            What Our
            <span style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginLeft: '8px'
            }}>
              Patients Say
            </span>
          </Title>

          <Paragraph style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Don't just take our word for it. Here's what our satisfied patients
            have to say about their experience with NLife.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {testimonials.map((testimonial) => (
            <Col key={testimonial.id} xs={24} lg={8}>
              <Card
                style={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                bodyStyle={{ padding: '32px 24px' }}
                className="testimonial-card"
              >
                {/* Quote Icon */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  fontSize: '24px',
                  color: '#6366F1',
                  opacity: 0.3
                }}>
                  <MessageOutlined />
                </div>

                {/* Rating */}
                <div style={{ marginBottom: '20px' }}>
                  <Rate disabled defaultValue={testimonial.rating} style={{ fontSize: '16px' }} />
                </div>

                {/* Comment */}
                <Paragraph style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#374151',
                  marginBottom: '24px',
                  fontStyle: 'italic'
                }}>
                  "{testimonial.comment}"
                </Paragraph>

                {/* Author Info */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    size={48}
                    style={{
                      backgroundColor: '#6366F1',
                      marginRight: '16px'
                    }}
                  >
                    {testimonial.name.charAt(0)}
                  </Avatar>

                  <div>
                    <Text style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      display: 'block'
                    }}>
                      {testimonial.name}
                    </Text>
                    <Text style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {testimonial.role} • {testimonial.location}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Trust Indicators */}
        <div style={{
          marginTop: '64px',
          textAlign: 'center',
          padding: '40px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '16px'
        }}>
          <Row gutter={[32, 16]} align="middle" justify="center">
            <Col xs={24} sm={6}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6366F1', marginBottom: '8px' }}>
                  4.9/5
                </div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>Average Rating</div>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6366F1', marginBottom: '8px' }}>
                  10K+
                </div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>Reviews</div>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6366F1', marginBottom: '8px' }}>
                  98%
                </div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>Satisfaction Rate</div>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6366F1', marginBottom: '8px' }}>
                  24/7
                </div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>Support Available</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <style jsx>{`
        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12) !important;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
