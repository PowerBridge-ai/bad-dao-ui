import React, { useEffect, useState } from 'react';
import { 
  ChakraProvider, 
  Container, 
  Box, 
  VStack, 
  Heading, 
  Text, 
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast
} from '@chakra-ui/react';
import EmailVerificationForm from './components/EmailVerificationForm';
import ResultsDisplay from './components/ResultsDisplay';
import { PlatformDefinition, VerificationRequest, VerificationResult } from './types';

function App() {
  // State
  const [platforms, setPlatforms] = useState<PlatformDefinition[]>([]);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<string>('');
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [cookieValue, setCookieValue] = useState<string>('');
  
  // Modal handling
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Toast notifications
  const toast = useToast();
  
  // Fetch platforms on initial load
  useEffect(() => {
    fetchPlatforms();
  }, []);
  
  // Fetch platforms from API
  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/platforms');
      const data = await response.json();
      
      if (data.success) {
        setPlatforms(data.data);
      } else {
        toast({
          title: 'Error fetching platforms',
          description: data.error || 'Unknown error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Network error',
        description: 'Could not connect to server',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Handle verification form submission
  const handleVerificationSubmit = async (request: VerificationRequest) => {
    setIsLoading(true);
    setResults([]);
    
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
        
        if (data.data.length === 0) {
          toast({
            title: 'No results',
            description: 'No platforms were verified',
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: 'Verification failed',
          description: data.error || 'Unknown error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Network error',
        description: 'Could not connect to server',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Export results as Excel
  const handleExportExcel = async () => {
    try {
      window.open('/api/report?format=excel', '_blank');
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export results as Excel',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Export results as Markdown
  const handleExportMarkdown = async () => {
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results,
          format: 'markdown',
          title: 'DevOpSec Search Report'
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.data.markdown) {
        // Create a blob and download it
        const blob = new Blob([data.data.markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'devopsec-search-report.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        throw new Error(data.error || 'Failed to generate Markdown');
      }
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export results as Markdown',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // Retry with captcha solution
  const handleRetryCaptcha = (platformId: string, email: string) => {
    // For now, we'll just open the cookie modal
    setCurrentPlatform(platformId);
    setCurrentEmail(email);
    onOpen();
  };
  
  // Add cookie for platform
  const handleAddCookie = (platformId: string) => {
    setCurrentPlatform(platformId);
    setCookieValue('');
    onOpen();
  };
  
  // Submit cookie
  const handleCookieSubmit = async () => {
    if (!cookieValue) {
      toast({
        title: 'Cookie required',
        description: 'Please enter a cookie value',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      const response = await fetch('/api/cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platformId: currentPlatform,
          cookie: cookieValue
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Cookie stored',
          description: 'Cookie has been stored for this platform',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
        
        // Retry verification for this platform if we have an email
        if (currentEmail) {
          handleVerificationSubmit({
            email: currentEmail,
            platforms: [currentPlatform]
          });
        }
      } else {
        toast({
          title: 'Failed to store cookie',
          description: data.error || 'Unknown error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Network error',
        description: 'Could not connect to server',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={12} align="stretch">
          <Box textAlign="center">
            <Heading size="2xl">DevOpSec Search</Heading>
            <Text mt={2} fontSize="lg">
              Discover platform accounts associated with organizational email addresses
            </Text>
          </Box>
          
          <EmailVerificationForm
            platforms={platforms}
            onSubmit={handleVerificationSubmit}
            isLoading={isLoading}
          />
          
          <ResultsDisplay
            results={results}
            onExportExcel={handleExportExcel}
            onExportMarkdown={handleExportMarkdown}
            onRetryCaptcha={handleRetryCaptcha}
            onAddCookie={handleAddCookie}
            isLoading={isLoading}
          />
        </VStack>
        
        {/* Cookie Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Cookie for Platform</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Cookie String</FormLabel>
                <Input 
                  value={cookieValue}
                  onChange={(e) => setCookieValue(e.target.value)}
                  placeholder="Paste cookie string here"
                />
                <Text fontSize="sm" mt={2} color="gray.600">
                  Get this cookie by logging into the platform manually and copying the cookies from browser developer tools.
                </Text>
              </FormControl>
              
              <Button 
                colorScheme="blue" 
                mt={4} 
                onClick={handleCookieSubmit}
                isFullWidth
              >
                Submit Cookie
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </ChakraProvider>
  );
}

export default App; 